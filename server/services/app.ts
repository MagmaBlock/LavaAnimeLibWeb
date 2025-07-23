import { PrismaClient } from "@prisma/client";
import { AnimeCollectionService } from "./anime/collection/service";
import { AnimeFileService } from "./anime/file/service";
import { AnimePictureSerivce } from "./anime/picture/serivce";
import { AnimeService } from "./anime/service";
import { Container } from "./container";
import type { ServiceContainer } from "./container/interface";
import { InviteCodeService } from "./invite-code/service";
import { Log4jsLogger } from "./logger/log4js";
import { StorageService } from "./storage/service";
import { UserService } from "./user/service";

export class App {
  public static instance: App;

  public services: ServiceContainer;
  public logger: Log4jsLogger;
  constructor() {
    App.instance = this;
    this.services = new Container();

    this.logger = new Log4jsLogger();

    const authSecret = process.env.AUTH_SECRET ?? Math.random().toString();

    this.services.registerService(new AnimeService());
    this.services.registerService(new AnimeCollectionService());
    this.services.registerService(new AnimeFileService());
    this.services.registerService(new AnimePictureSerivce());
    this.services.registerService(new InviteCodeService());
    this.services.registerService(new StorageService());
    this.services.registerService(new UserService(authSecret));
  }
}
