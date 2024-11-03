import { DataSource } from 'typeorm';
import { Node } from './nodes/entities/node.entity';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Node],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? './dist/src/migrations/*.js'
      : './src/migrations/*.ts',
  ],
  synchronize: false,
});

export default AppDataSource;
