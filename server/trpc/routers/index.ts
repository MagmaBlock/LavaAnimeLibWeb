import { router } from "../trpc";
import { animeCardRouter } from "./components/anime-card";
import { animeIndexRouter } from "./page/anime-index";

export const appRouter = router({
  pages: router({
    animeIndex: animeIndexRouter,
  }),
  components: router({
    animeCard: animeCardRouter,
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
