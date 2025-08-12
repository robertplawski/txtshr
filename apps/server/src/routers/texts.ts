import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { texts } from "../db/schema/texts";
import { db } from "../db";
import { eq, desc, or, and, like } from "drizzle-orm";
import { nanoid } from "nanoid";

const deleteTextSchema = z.object({
  id: z.string(),
});

const createTextSchema = z.object({
  title: z.string().min(1).max(35),
  content: z.string().min(1),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
});

const getTextsSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

const getTextSchema = z.object({
  id: z.string(),
});

export const textsRouter = router({
  delete: protectedProcedure
    .input(deleteTextSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const result = await db
        .delete(texts)
        .where(and(like(texts.id, id), eq(texts.userId, ctx.session.user.id)))
        .returning();
      if (result.length == 0) {
        throw Error("You can only delete your own texts");
      }
    }),
  create: protectedProcedure
    .input(createTextSchema)
    .mutation(async ({ input, ctx }) => {
      const id = nanoid(10);
      const now = new Date();

      const [text] = await db
        .insert(texts)
        .values({
          id,
          title: input.title,
          content: input.content,
          visibility: input.visibility,
          userId: ctx.session.user.id,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return text;
    }),

  createAnonymous: publicProcedure
    .input(createTextSchema.omit({ visibility: true }))
    .mutation(async ({ input }) => {
      const id = nanoid(10);
      const now = new Date();

      const [text] = await db
        .insert(texts)
        .values({
          id,
          title: input.title,
          content: input.content,
          visibility: "public",
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return text;
    }),

  getAll: publicProcedure.input(getTextsSchema).query(async ({ input }) => {
    const { user } = await import("../db/schema/auth");

    const [allTexts, totalCount] = await Promise.all([
      db
        .select({
          id: texts.id,
          title: texts.title,
          createdAt: texts.createdAt,
          userId: texts.userId,
          username: user.name,
        })
        .from(texts)
        .leftJoin(user, eq(texts.userId, user.id))
        .where(eq(texts.visibility, "public"))
        .orderBy(desc(texts.createdAt))
        .limit(input.limit)
        .offset(input.offset),
      db
        .select({ count: texts.id })
        .from(texts)
        .where(eq(texts.visibility, "public"))
        .then((result) => result.length),
    ]);

    return {
      texts: allTexts,
      totalCount,
      hasMore: input.offset + input.limit < totalCount,
    };
  }),

  getById: publicProcedure
    .input(getTextSchema)
    .query(async ({ input, ctx }) => {
      const { user } = await import("../db/schema/auth");

      const text = await db
        .select({
          id: texts.id,
          title: texts.title,
          content: texts.content,
          visibility: texts.visibility,
          createdAt: texts.createdAt,
          updatedAt: texts.updatedAt,
          userId: texts.userId,
          username: user.name,
        })
        .from(texts)
        .leftJoin(user, eq(texts.userId, user.id))
        .where(eq(texts.id, input.id))
        .limit(1);

      if (!text.length) {
        throw new Error("Text not found");
      }

      const textData = text[0];

      // Check visibility permissions
      if (textData.visibility === "private") {
        if (!ctx.session?.user || ctx.session.user.id !== textData.userId) {
          throw new Error("Access denied");
        }
      }

      return textData;
    }),

  getMyTexts: protectedProcedure
    .input(getTextsSchema)
    .query(async ({ input, ctx }) => {
      const [myTexts, totalCount] = await Promise.all([
        db
          .select({
            id: texts.id,
            title: texts.title,
            visibility: texts.visibility,
            createdAt: texts.createdAt,
          })
          .from(texts)
          .where(eq(texts.userId, ctx.session.user.id))
          .orderBy(desc(texts.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        db
          .select({ count: texts.id })
          .from(texts)
          .where(eq(texts.userId, ctx.session.user.id))
          .then((result) => result.length),
      ]);

      return {
        texts: myTexts,
        totalCount,
        hasMore: input.offset + input.limit < totalCount,
      };
    }),
});
