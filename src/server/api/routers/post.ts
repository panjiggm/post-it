import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { onTRPCError } from "~/utils/onTRPCError";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ ctx, input }) => {
      const { title } = input;

      // Check Title
      if (title.length > 300) {
        onTRPCError("BAD_REQUEST", "Please write a shorter post!");
      }
      if (!title.length) {
        onTRPCError("BAD_REQUEST", "Please do not leave this empty!");
      }

      // Create Post
      return ctx.prisma.post.create({
        data: {
          title,
          userId: ctx.session.user.id,
        },
      });
    }),
});
