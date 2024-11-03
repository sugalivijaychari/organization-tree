import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity()
@Tree("closure-table")
export class Node {
  @PrimaryGeneratedColumn()
  nodeId: number;

  @Column()
  nodeName: string;

  @Column()
  nodeType: string;

  @Column({ nullable: true })
  nodeColor: string;

  @ManyToOne(() => Node, node => node.children, { nullable: true, onDelete: 'CASCADE' })
  @TreeParent()
  parent: Node;

  @TreeChildren()
  children: Node[];
}
