import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client";
import superjson from "superjson";
import type { AppRouter } from "~/server/trpc/routers";

export default defineNuxtPlugin(() => {
  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const client = createTRPCNuxtClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
  });

  return {
    provide: {
      client,
    },
  };
});
