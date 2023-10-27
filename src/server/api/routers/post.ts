import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
}

const articles: Article[] = [
  { id: 1, title: "Title#1", excerpt: "Excerpt", content: "content" },
  { id: 2, title: "Title#2", excerpt: "Excerpt", content: "content" },
  { id: 3, title: "Title#3", excerpt: "Excerpt", content: "content" },
  { id: 4, title: "Title#4", excerpt: "Excerpt", content: "content" },
];

export const articleRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return articles;
  }),
  add: publicProcedure
    .input(
      z.object({ title: z.string(), excerpt: z.string(), content: z.string() }),
    )
    .mutation(({ input }) => {
      const article = { id: articles.length + 1, ...input };
      articles.push(article);
      return article;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z
          .object({
            title: z.string(),
            excerpt: z.string(),
            content: z.string(),
          })
          .partial(),
      }),
    )
    .mutation(({ input }) => {
      const { id, data } = input;
      const article = articles.find((article) => article.id === id);
      if (!article)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Not found article",
        });

      if (data.title) article.title = data.title;
      if (data.excerpt) article.excerpt = data.excerpt;
      if (data.content) article.content = data.content;
      return article;
    }),
  remove: publicProcedure.input(z.number()).mutation(({ input }) => {
    const article = articles.findIndex((article) => article.id === input);
    articles.splice(article, 1);
  }),
});
