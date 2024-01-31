import appConfig from "./app.config";
import databaseConfig from "./database.config";
import authConfig from "./auth.config";

export { appConfig as appConfiguration,  authConfig as authConfigConfiguration, databaseConfig as databaseConfiguration}

export * from './auth-config.type'
export * from './app-config.type'
export * from './database-config.type'