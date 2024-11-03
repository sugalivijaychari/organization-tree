import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodesController } from './nodes.controller';
import { Node } from './entities/node.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  providers: [NodesService],
  controllers: [NodesController],
})
export class NodesModule {}
