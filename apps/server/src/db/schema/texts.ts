import { sqliteTable, text as textField, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

export const visibilityEnum = ["public", "unlisted", "private"] as const;
export type Visibility = typeof visibilityEnum[number];

export const texts = sqliteTable("texts", {
  id: textField("id").primaryKey(),
  title: textField("title").notNull(),
  content: textField("content").notNull(),
  visibility: textField("visibility", { enum: visibilityEnum }).notNull().default("public"),
  userId: textField("user_id").references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const textsRelations = relations(texts, ({ one }) => ({
  user: one(user, {
    fields: [texts.userId],
    references: [user.id],
  }),
}));