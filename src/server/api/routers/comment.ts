import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { onTRPCError } from "~/utils/onTRPCError";
import { ratelimit } from "~/utils/retelimit";

export const commentRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      const { postId } = input;

      return ctx.prisma.comment.findMany({
        where: {
          postId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ comment: z.string(), postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { comment, postId } = input;
      const userId = ctx.session.user.id;

      const { success } = await ratelimit.limit(userId);

      // Check Title
      if (comment.length > 300) {
        onTRPCError("BAD_REQUEST", "Please write a shorter comment!");
      }
      if (!comment.length) {
        onTRPCError("BAD_REQUEST", "Please do not leave this empty!");
      }
      if (!success) {
        void onTRPCError(
          "TOO_MANY_REQUESTS",
          "Please wait, requests to create posts are limited 🙏"
        );
      }

      // Add comment
      const message = await ctx.prisma.comment.create({
        data: {
          message: comment,
          postId,
          userId,
        },
      });

      return message;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
