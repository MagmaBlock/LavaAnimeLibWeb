import { router } from "../trpc";
import { animeCollectionRouter } from "./common/anime-collection";
import { animeViewHistoryRouter } from "./common/anime-view-history";
import { animeCardRouter } from "./components/anime-card";
import { adminInviteCodeRouter } from "./pages/admin/invite-code";
import { adminStorageIndexRouter as adminStorageFileIndexRouter } from "./pages/admin/storage/index";
import { animeRouter } from "./pages/anime";
import { animeIndexRouter } from "./pages/anime-index";
import { authRouter } from "./pages/auth";
import { userRouter } from "./pages/user";
import { userInfoRouter } from "./pages/user-info";
import { adminStorageManagerRouter } from "./pages/admin/storage/manage";
import { adminStorageScrapeRouter } from "./pages/admin/storage/scrape";
import { adminStoragePathSelectorRouter } from "./components/admin/storage/path-selector";
import { adminAnimeManageRouter } from "./pages/admin/anime/manage";
export const appRouter = router({
  pages: router({
    animeIndex: animeIndexRouter,
    auth: authRouter,
    user: userRouter,
    userInfo: userInfoRouter,
    anime: animeRouter,
    admin: router({
      anime: router({
        manage: adminAnimeManageRouter,
      }),
      inviteCode: adminInviteCodeRouter,
      storage: router({
        fileIndex: adminStorageFileIndexRouter,
        manager: adminStorageManagerRouter,
        scrape: adminStorageScrapeRouter,
      }),
    }),
  }),
  components: router({
    animeCard: animeCardRouter,
    admin: router({
      storage: router({
        pathSelector: adminStoragePathSelectorRouter,
      }),
    }),
  }),
  common: router({
    animeViewHistory: animeViewHistoryRouter,
    animeCollection: animeCollectionRouter,
  }),
});

// 导出 API 的类型定义
export type AppRouter = typeof appRouter;
