import { Test, TestingModule } from '@nestjs/testing';
import { NodesService } from './nodes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Node } from './entities/node.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('NodesService', () => {
  let service: NodesService;
  let repository: Repository<Node>;

  // Create a mock repository
  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    findTrees: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodesService,
        {
          provide: getRepositoryToken(Node),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NodesService>(NodesService);
    repository = module.get<Repository<Node>>(getRepositoryToken(Node));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should be defined', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createNode', () => {
    it('should create a new node', async () => {
      const nodeData = {
        nodeName: 'Engineering',
        nodeType: 'department',
        parentId: 1,
      };
      const parentNode = {
        nodeId: 1,
        nodeName: 'Root',
        nodeType: 'organization',
      };
      const createdNode = {
        nodeId: 2,
        ...nodeData,
        nodeColor: '#F6AF8E',
        parent: parentNode,
      };

      // Mocking findOne to return the parent node when queried with parentId
      mockRepository.findOne.mockResolvedValue(parentNode);
      mockRepository.create.mockReturnValue(createdNode);
      mockRepository.save.mockResolvedValue(createdNode);

      const result = await service.createNode(
        nodeData.nodeName,
        nodeData.nodeType,
        nodeData.parentId,
      );

      expect(result).toEqual(createdNode);
      expect(mockRepository.create).toHaveBeenCalledWith({
        nodeName: nodeData.nodeName,
        nodeType: nodeData.nodeType,
        parent: parentNode, // Expect parentNode to match the mocked return value
        nodeColor: '#F6AF8E',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdNode);
    });
  });

  describe('deleteNodeWithShift', () => {
    it('should delete a node and shift children', async () => {
      const node = {
        nodeId: 1,
        children: [{ nodeId: 2 }],
        parent: { nodeId: 0 },
      };
      mockRepository.findOne.mockResolvedValue(node);
      mockRepository.save.mockResolvedValue({});
      mockRepository.remove.mockResolvedValue({});

      await service.deleteNodeWithShift(node.nodeId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { nodeId: node.nodeId },
        relations: ['children', 'parent'],
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockRepository.remove).toHaveBeenCalledWith(node);
    });

    it('should throw NotFoundException if node does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteNodeWithShift(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { nodeId: 1 },
        relations: ['children', 'parent'],
      });
    });
  });
});
