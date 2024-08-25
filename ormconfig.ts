import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres', // O el tipo de base de datos que uses
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNC === 'true', // Solo para desarrollo
};

export default ormconfig;
