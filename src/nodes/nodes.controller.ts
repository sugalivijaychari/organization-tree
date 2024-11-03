import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('nodes')
@Controller('api/nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @ApiOperation({ summary: 'Create a new node' })
  @ApiBody({ type: CreateNodeDto })
  @Post()
  async createNode(@Body() createNodeDto: CreateNodeDto) {
    return this.nodesService.createNode(
      createNodeDto.nodeName,
      createNodeDto.nodeType,
      createNodeDto.parentId,
    );
  }

  @ApiOperation({ summary: 'Update a node with shift' })
  @ApiParam({ name: 'nodeId', description: 'ID of the node to update' })
  @ApiBody({ type: UpdateNodeDto })
  @Put('with-shift/:nodeId')
  async updateNodeWithShift(
    @Param('nodeId') nodeId: number,
    @Body() updateNodeDto: UpdateNodeDto,
  ) {
    return this.nodesService.updateNodeWithShift(
      nodeId,
      updateNodeDto.parentId,
    );
  }

  @ApiOperation({ summary: 'Update a node without shift' })
  @ApiParam({ name: 'nodeId', description: 'ID of the node to update' })
  @ApiBody({ type: UpdateNodeDto })
  @Put('without-shift/:nodeId')
  async updateNodeWithoutShift(
    @Param('nodeId') nodeId: number,
    @Body() updateNodeDto: UpdateNodeDto,
  ) {
    return this.nodesService.updateNodeWithoutShift(
      nodeId,
      updateNodeDto.parentId,
    );
  }

  @ApiOperation({ summary: 'Delete a node and shift its children to parent' })
  @ApiParam({ name: 'nodeId', description: 'ID of the node to delete' })
  @Delete('with-shift/:nodeId')
  async deleteNodeWithShift(@Param('nodeId') nodeId: number) {
    return this.nodesService.deleteNodeWithShift(nodeId);
  }

  @ApiOperation({ summary: 'Delete a node along with its children' })
  @ApiParam({ name: 'nodeId', description: 'ID of the node to delete' })
  @Delete('without-shift/:nodeId')
  async deleteNodeWithoutShift(@Param('nodeId') nodeId: number) {
    return this.nodesService.deleteNodeWithoutShift(nodeId);
  }

  @ApiOperation({ summary: 'Get the entire organization tree' })
  @Get('tree')
  async getOrganizationTree() {
    return this.nodesService.getOrganizationTree();
  }
}
