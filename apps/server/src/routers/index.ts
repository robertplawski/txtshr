import { router } from "../lib/trpc";
import { textsRouter } from "./texts";

export const appRouter = router({
  texts: textsRouter,
});
export type AppRouter = typeof appRouter;
