import { type PostgrestSingleResponse } from "@supabase/supabase-js";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const post = {
  id: 1,
  name: "Hello World",
};

export const actionsRouter = createTRPCRouter({
  createCode: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const ret = await ctx.supabase?.from("codes").insert({ value: input });
      if (ret?.error) {
        return ret.error;
      }
      return input;
    }),

  lookup: privateProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!ctx.supabase) return undefined;
    const pseudResponses = await ctx.supabase
      .from("pseud_responses")
      .select()
      .eq("pseud", input);
    const detailResponses = await ctx.supabase
      .from("detail")
      .select()
      .eq("pseud", input);
    const testResponses = await ctx.supabase
      .from("blue_dye_resp")
      .select()
      .eq("pseud", input);

    const clean = <T>(input: PostgrestSingleResponse<T[]>) => {
      return input.error ? input.error : input.data;
    };
    return {
      responses: clean(pseudResponses),
      detailResponses: clean(detailResponses),
      testResponses: clean(testResponses),
    };
  }),
});
