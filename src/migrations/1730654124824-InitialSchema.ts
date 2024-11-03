import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1730654124824 implements MigrationInterface {
    name = 'InitialSchema1730654124824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "node" ("nodeId" SERIAL NOT NULL, "nodeName" character varying NOT NULL, "nodeType" character varying NOT NULL, "nodeColor" character varying, "parentNodeId" integer, CONSTRAINT "PK_3037e5476dc2bf5c40e98922c64" PRIMARY KEY ("nodeId"))`);
        await queryRunner.query(`CREATE TABLE "node_closure" ("nodeId_ancestor" integer NOT NULL, "nodeId_descendant" integer NOT NULL, CONSTRAINT "PK_13db0ca2859ae0b56e1b11b0d54" PRIMARY KEY ("nodeId_ancestor", "nodeId_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_258d76fdac81a8751c66f8fe79" ON "node_closure" ("nodeId_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_bf7431b113e759845677a442c2" ON "node_closure" ("nodeId_descendant") `);
        await queryRunner.query(`ALTER TABLE "node" ADD CONSTRAINT "FK_bc299986e4a9da1ddb9df3bae45" FOREIGN KEY ("parentNodeId") REFERENCES "node"("nodeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "node_closure" ADD CONSTRAINT "FK_258d76fdac81a8751c66f8fe79d" FOREIGN KEY ("nodeId_ancestor") REFERENCES "node"("nodeId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "node_closure" ADD CONSTRAINT "FK_bf7431b113e759845677a442c24" FOREIGN KEY ("nodeId_descendant") REFERENCES "node"("nodeId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "node_closure" DROP CONSTRAINT "FK_bf7431b113e759845677a442c24"`);
        await queryRunner.query(`ALTER TABLE "node_closure" DROP CONSTRAINT "FK_258d76fdac81a8751c66f8fe79d"`);
        await queryRunner.query(`ALTER TABLE "node" DROP CONSTRAINT "FK_bc299986e4a9da1ddb9df3bae45"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf7431b113e759845677a442c2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_258d76fdac81a8751c66f8fe79"`);
        await queryRunner.query(`DROP TABLE "node_closure"`);
        await queryRunner.query(`DROP TABLE "node"`);
    }

}
