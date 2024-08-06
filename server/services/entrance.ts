import { AnimeService } from "./anime/service";
import { InviteCodeService } from "./invite-code/service";
import { LibraryService } from "./library/service";
import { TokenService } from "./token/service";
import { UserService } from "./user/service";

// TODO: 不再在 Service（原 Manager）中管理下级 Service，Service 的管理应该由 Entrance 管理。

export class Entrance {
  private static instance: Entrance;
  constructor() {
    Entrance.instance = this;
  }
  static getInstance() {
    if (!Entrance.instance) {
      new Entrance();
    }
    return Entrance.instance;
  }

  getAnimeManager() {
    return new AnimeService();
  }

  getInviteCodeManager() {
    return new InviteCodeService();
  }

  getLibraryManager() {
    return new LibraryService();
  }

  getUserManager() {
    return new UserService();
  }

  getTokenManager() {
    return new TokenService();
  }
}
