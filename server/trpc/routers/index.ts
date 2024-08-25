import { router } from "../trpc";
import { animeCardRouter } from "./components/anime-card";
import { animeRouter } from "./page/anime";
import { animeIndexRouter } from "./page/anime-index";
import { authRouter } from "./page/auth";
import { userRouter } from "./page/user";
import { userInfoRouter } from "./page/user-info";

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
});

// 导出 API 的类型定义
export type AppRouter = typeof appRouter;
