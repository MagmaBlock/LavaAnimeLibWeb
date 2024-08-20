import { router } from "../trpc";
import { animeCardRouter } from "./components/anime-card";
import { animeIndexRouter } from "./page/anime-index";
import { authRouter } from "./page/auth";

export const appRouter = router({
  pages: router({
    animeIndex: animeIndexRouter,
    auth: authRouter,
  }),
  components: router({
    animeCard: animeCardRouter,
  }),
});

// 导出 API 的类型定义
export type AppRouter = typeof appRouter;
