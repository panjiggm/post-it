import { z } from "zod";
import { onTRPCError } from "~/utils/onTRPCError";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { ratelimit } from "~/utils/retelimit";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        user: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getMyPost: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        user: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  postDetail: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include: {
          user: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: true,
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { title } = input;
      const userId = ctx.session.user.id;

      const { success } = await ratelimit.limit(userId);

      // Check Title
      if (title.length > 300) {
        void onTRPCError("BAD_REQUEST", "Please write a shorter post!");
      }
      if (!title.length) {
        void onTRPCError("BAD_REQUEST", "Please do not leave this empty!");
      }
      if (!success) {
        void onTRPCError(
          "TOO_MANY_REQUESTS",
          "Please wait, requests to create posts are limited 🙏"
        );
      }

      // Create Post
      const post = await ctx.prisma.post.create({
        data: {
          title,
          userId,
        },
      });

      return post;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
