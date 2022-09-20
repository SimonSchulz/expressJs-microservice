export default {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  logging: false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  entities: [`src/entities/**/*.ts`],
  migrations: [`src/database/migration/**/*.ts`],
  cli: {
    entitiesDir: '/src/entities',
    migrationsDir: 'src/database/migration',
  },
  name: 'default',
  database: process.env.POSTGRES_DB || 'node_project',
  synchronize: false,
};
