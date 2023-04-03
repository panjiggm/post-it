import { z } from "zod";
import { onTRPCError } from "~/utils/onTRPCError";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { ratelimit } from "~/utils/retelimit";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(5).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 5;
      const { cursor } = input;
      const userId = ctx.session?.user?.id;

      const posts = await ctx.prisma.post.findMany({
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
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
  getMyPost: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session?.user?.id;

    return ctx.prisma.post.findMany({
      where: {
        userId,
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
        likes: {
          where: {
            userId,
          },
          select: {
            userId: true,
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
      const userId = ctx.session?.user?.id;

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
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
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
      // Limit request
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
  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.prisma.likePost.create({
        data: {
          post: {
            connect: {
              id: input.postId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  unlike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.prisma.likePost.delete({
        where: {
          postId_userId: {
            postId: input.postId,
            userId,
          },
        },
      });
    }),
});
