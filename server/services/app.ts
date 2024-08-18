import { PrismaClient } from "@prisma/client";
import { AnimeCollectionService } from "./anime/collection/service";
import { AnimeService } from "./anime/service";
import { Container } from "./container";
import type { ServiceContainer } from "./container/interface";
import { InviteCodeService } from "./invite-code/service";
import { StorageService } from "./storage/service";
import { Log4jsLogger } from "./logger/log4js";
import { UserService } from "./user/service";

export class App {
  public static instance: App;

  public services: ServiceContainer;
  public prisma: PrismaClient;
  public logger: Log4jsLogger;
  constructor() {
    App.instance = this;
    this.services = new Container();

    this.prisma = new PrismaClient();
    this.logger = new Log4jsLogger();

    const authSecret = process.env.AUTH_SECRET ?? Math.random().toString();

    this.services.registerService(new AnimeService());
    this.services.registerService(new AnimeCollectionService());
    this.services.registerService(new InviteCodeService());
    this.services.registerService(new StorageService());
    this.services.registerService(new UserService(authSecret));
  }
}
