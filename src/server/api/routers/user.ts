import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.supabase?.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
    }),

  logout: privateProcedure.mutation(async ({ ctx }) => {
    return await ctx.supabase?.auth.signOut();
  }),

  updatePassword: publicProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.supabase?.auth.updateUser({
        password: input.password,
      });
    }),
});
