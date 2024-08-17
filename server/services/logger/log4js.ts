import log4js from "log4js";
import type { Logger } from "./interface";
import type { Logger as Log4jsLoggerInstance } from "log4js";

export class Log4jsLogger implements Logger {
  private logger: Log4jsLoggerInstance;

  constructor() {
    log4js.configure({
      appenders: {
        stdout: { type: "stdout" },
        file: {
          type: "file",
          filename: "logs/server.log",
          maxLogSize: "5m",
          compress: true,
          backups: 10,
        },
      },
      categories: {
        default: { appenders: ["stdout", "file"], level: "trace" },
        http: { appenders: ["stdout", "file"], level: "trace" },
      },
    });

    this.logger = log4js.getLogger();
  }

  trace(message: any, ...args: any[]): void {
    this.logger.trace(message, ...args);
  }
  debug(message: any, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }
  info(message: any, ...args: any[]): void {
    this.logger.info(message, ...args);
  }
  warn(message: any, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }
  error(message: any, ...args: any[]): void {
    this.logger.error(message, ...args);
  }
  fatal(message: any, ...args: any[]): void {
    this.logger.fatal(message, ...args);
  }
}
