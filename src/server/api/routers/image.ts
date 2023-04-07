import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const imageRouter = createTRPCRouter({
  getByPost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      const { postId } = input;

      return ctx.prisma.image.findMany({
        where: {
          postId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        images: z
          .array(
            z.object({
              url: z.string(),
              postId: z.string(),
            })
          )
          .max(4),
      })
    )
    .mutation(({ ctx, input }) => {
      const { images } = input;

      return ctx.prisma.image.createMany({
        data: images,
      });
    }),
});
