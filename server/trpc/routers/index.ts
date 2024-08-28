import { router } from "../trpc";
import { animeCollectionRouter } from "./common/anime-collection";
import { animeViewHistoryRouter } from "./common/anime-view-history";
import { animeCardRouter } from "./components/anime-card";
import { animeRouter } from "./pages/anime";
import { animeIndexRouter } from "./pages/anime-index";
import { authRouter } from "./pages/auth";
import { userRouter } from "./pages/user";
import { userInfoRouter } from "./pages/user-info";

export const appRouter = router({
  pages: router({
    animeIndex: animeIndexRouter,
    auth: authRouter,
    user: userRouter,
    userInfo: userInfoRouter,
    anime: animeRouter,
  }),
  components: router({
    animeCard: animeCardRouter,
  }),
  common: router({
    animeViewHistory: animeViewHistoryRouter,
    animeCollection: animeCollectionRouter,
  }),
});

// 导出 API 的类型定义
export type AppRouter = typeof appRouter;
