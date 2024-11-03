import { Test, TestingModule } from '@nestjs/testing';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('NodesController', () => {
  let controller: NodesController;
  let service: NodesService;

  const mockNodesService = {
    createNode: jest.fn(),
    updateNodeWithShift: jest.fn(),
    updateNodeWithoutShift: jest.fn(),
    deleteNodeWithShift: jest.fn(),
    deleteNodeWithoutShift: jest.fn(),
    getOrganizationTree: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodesController],
      providers: [{ provide: NodesService, useValue: mockNodesService }],
    }).compile();

    controller = module.get<NodesController>(NodesController);
    service = module.get<NodesService>(NodesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNode', () => {
    it('should create a node', async () => {
      const dto: CreateNodeDto = {
        nodeName: 'Engineering',
        nodeType: 'department',
        parentId: 1,
      };
      mockNodesService.createNode.mockResolvedValue({ nodeId: 1, ...dto });

      const result = await controller.createNode(dto);
      expect(result).toEqual({ nodeId: 1, ...dto });
      expect(service.createNode).toHaveBeenCalledWith(
        dto.nodeName,
        dto.nodeType,
        dto.parentId,
      );
    });
  });

  describe('updateNodeWithShift', () => {
    it('should update a node with children shift', async () => {
      const dto: UpdateNodeDto = { parentId: 2 };
      mockNodesService.updateNodeWithShift.mockResolvedValue({
        nodeId: 1,
        ...dto,
      });

      const result = await controller.updateNodeWithShift(1, dto);
      expect(result).toEqual({ nodeId: 1, ...dto });
      expect(service.updateNodeWithShift).toHaveBeenCalledWith(1, dto.parentId);
    });

    it('should throw NotFoundException if node does not exist', async () => {
      mockNodesService.updateNodeWithShift.mockRejectedValue(
        new NotFoundException('Node not found'),
      );

      await expect(
        controller.updateNodeWithShift(1, { parentId: 2 }),
      ).rejects.toThrow(NotFoundException);
      expect(service.updateNodeWithShift).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('updateNodeWithoutShift', () => {
    it('should update a node without shifting children', async () => {
      const dto: UpdateNodeDto = { parentId: 2 };
      mockNodesService.updateNodeWithoutShift.mockResolvedValue({
        nodeId: 1,
        ...dto,
      });

      const result = await controller.updateNodeWithoutShift(1, dto);
      expect(result).toEqual({ nodeId: 1, ...dto });
      expect(service.updateNodeWithoutShift).toHaveBeenCalledWith(
        1,
        dto.parentId,
      );
    });

    it('should throw BadRequestException if cycle is detected', async () => {
      mockNodesService.updateNodeWithoutShift.mockRejectedValue(
        new BadRequestException('Cycle detected in hierarchy'),
      );

      await expect(
        controller.updateNodeWithoutShift(1, { parentId: 2 }),
      ).rejects.toThrow(BadRequestException);
      expect(service.updateNodeWithoutShift).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('deleteNodeWithShift', () => {
    it('should delete a node with children shifted to parent', async () => {
      mockNodesService.deleteNodeWithShift.mockResolvedValue(undefined);

      await controller.deleteNodeWithShift(1);
      expect(service.deleteNodeWithShift).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if node does not exist', async () => {
      mockNodesService.deleteNodeWithShift.mockRejectedValue(
        new NotFoundException('Node not found'),
      );

      await expect(controller.deleteNodeWithShift(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.deleteNodeWithShift).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteNodeWithoutShift', () => {
    it('should delete a node along with its children', async () => {
      mockNodesService.deleteNodeWithoutShift.mockResolvedValue(undefined);

      await controller.deleteNodeWithoutShift(1);
      expect(service.deleteNodeWithoutShift).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if node does not exist', async () => {
      mockNodesService.deleteNodeWithoutShift.mockRejectedValue(
        new NotFoundException('Node not found'),
      );

      await expect(controller.deleteNodeWithoutShift(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.deleteNodeWithoutShift).toHaveBeenCalledWith(1);
    });
  });

  describe('getOrganizationTree', () => {
    it('should return the organization tree', async () => {
      const mockTree = [{ nodeId: 1, nodeName: 'Root', children: [] }];
      mockNodesService.getOrganizationTree.mockResolvedValue(mockTree);

      const result = await controller.getOrganizationTree();
      expect(result).toEqual(mockTree);
      expect(service.getOrganizationTree).toHaveBeenCalled();
    });
  });
});
