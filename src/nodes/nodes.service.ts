import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Node } from './entities/node.entity';
import { TreeRepository } from 'typeorm';

@Injectable()
export class NodesService {
  private readonly logger = new Logger(NodesService.name);

  private colorPool = [
    '#F6AF8E',
    '#C3A5FF',
    '#B1D0A5',
    '#F6ED8E',
    '#8EF4F6',
    '#C0F68E',
    '#F68ECB',
    '#8E97F6',
    '#F68EAB',
    '#F6CE8E',
    '#DFF68E',
  ];
  private colorIndex = 0;

  constructor(
    @InjectRepository(Node)
    private nodesRepository: TreeRepository<Node>,
  ) {}

  private assignColor(): string {
    const color = this.colorPool[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % this.colorPool.length;
    return color;
  }

  async createNode(
    nodeName: string,
    nodeType: string,
    parentId: number,
  ): Promise<Node> {
    const parent = await this.nodesRepository.findOne({
      where: { nodeId: parentId },
    });

    if (parent && (await this.detectCycle(parent))) {
      throw new Error('Cycle detected in hierarchy.');
    }

    const newNode = this.nodesRepository.create({
      nodeName,
      nodeType,
      parent,
      nodeColor:
        nodeType === 'location' || nodeType === 'department'
          ? this.assignColor()
          : null,
    });

    return this.nodesRepository.save(newNode);
  }

  async updateNodeWithShift(nodeId: number, parentId: number): Promise<Node> {
    const { node, newParent } = await this.validateAndFetchNodes(
      nodeId,
      parentId,
    );

    node.parent = newParent;
    return this.nodesRepository.save(node);
  }

  async updateNodeWithoutShift(
    nodeId: number,
    parentId: number,
  ): Promise<Node> {
    const { node, newParent } = await this.validateAndFetchNodes(
      nodeId,
      parentId,
    );

    const originalParent = node.parent;
    if (originalParent) {
      this.logger.log(
        `Reassigning children of nodeId ${nodeId} to originalParent with ID: ${originalParent.nodeId}`,
      );
      for (const child of node.children) {
        child.parent = originalParent;
        await this.nodesRepository.save(child);
        this.logger.log(
          `Updated child (ID: ${child.nodeId}) parent to originalParent (ID: ${originalParent.nodeId})`,
        );
      }
    } else {
      this.logger.warn(
        `No original parent found for nodeId: ${nodeId}, skipping child reassignment.`,
      );
    }

    node.children = [];
    node.parent = newParent;
    const updatedNode = await this.nodesRepository.save(node);

    this.logger.log(
      `Moved node (ID: ${nodeId}) to newParent (ID: ${parentId})`,
    );
    return updatedNode;
  }

  private async validateAndFetchNodes(nodeId: number, parentId: number) {
    const node = await this.nodesRepository.findOne({
      where: { nodeId },
      relations: ['children', 'parent'],
    });

    if (!node) {
      throw new NotFoundException(`Node with ID ${nodeId} not found`);
    }

    const newParent = await this.nodesRepository.findOne({
      where: { nodeId: parentId },
    });
    if (!newParent) {
      throw new NotFoundException(`Parent node with ID ${parentId} not found`);
    }

    if (await this.detectCycle(newParent)) {
      throw new BadRequestException('Updating this parent will cause a cycle.');
    }

    return { node, newParent };
  }

  private async detectCycle(node: Node): Promise<boolean> {
    let current = node;
    while (current.parent) {
      if (current.parent.nodeId === node.nodeId) return true;
      current = current.parent;
    }
    return false;
  }

  async deleteNodeWithShift(nodeId: number): Promise<void> {
    const node = await this.nodesRepository.findOne({
      where: { nodeId },
      relations: ['children', 'parent'],
    });

    if (!node) {
      throw new NotFoundException(`Node with ID ${nodeId} not found`);
    }

    const originalParent = node.parent;
    if (originalParent) {
      this.logger.log(
        `Shifting children of nodeId ${nodeId} to original parent (ID: ${originalParent.nodeId})`,
      );
      for (const child of node.children) {
        child.parent = originalParent;
        await this.nodesRepository.save(child);
        this.logger.log(
          `Updated child (ID: ${child.nodeId}) parent to originalParent (ID: ${originalParent.nodeId})`,
        );
      }
    } else {
      this.logger.warn(
        `Node ${nodeId} has no parent; children will not be reassigned.`,
      );
    }

    await this.nodesRepository.remove(node);
    this.logger.log(
      `Node ${nodeId} deleted with children shifted to original parent.`,
    );
  }

  async deleteNodeWithoutShift(nodeId: number): Promise<void> {
    const node = await this.nodesRepository.findOne({
      where: { nodeId },
      relations: ['children', 'parent'],
    });

    if (!node) {
      throw new NotFoundException(`Node with ID ${nodeId} not found`);
    }

    this.logger.log(`Deleting node ${nodeId} along with its children`);
    await this.nodesRepository.remove([...node.children, node]);
    this.logger.log(`Node ${nodeId} and all its children have been deleted.`);
  }

  async getOrganizationTree(): Promise<Node[]> {
    return this.nodesRepository.findTrees();
  }
}
