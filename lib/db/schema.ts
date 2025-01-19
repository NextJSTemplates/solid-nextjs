import {
    pgTable,
    uuid,
    varchar,
    text,
    json,
    foreignKey,
    integer,
    boolean,
    timestamp,
    primaryKey,
} from "drizzle-orm/pg-core";
import { type InferSelectModel, sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

// User table
export const user = pgTable("User", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name"),
    email: varchar("email").notNull().unique(),
    emailVerified: timestamp("emailVerified"),
    ethereum: varchar("ethereum"),
    image: text("image"),
    password: text("password"),
    createdAt: timestamp("createdAt").default(sql`now()`),
    updatedAt: timestamp("updatedAt")
        .default(sql`now()`)
        .$onUpdateFn(() => sql`now()`),
});
export type User = InferSelectModel<typeof user>;

// Account table
export const account = pgTable("Account", {
    userId: uuid("userId")
        .notNull()
        .references(() => user.id),
    type: varchar("type").notNull(),
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    createdAt: timestamp("createdAt").default(sql`now()`),
    updatedAt: timestamp("updatedAt")
        .default(sql`now()`)
        .$onUpdateFn(() => sql`now()`),
}, (table) => ({
    compositePk: primaryKey(table.provider, table.providerAccountId),
}));
export type Account = InferSelectModel<typeof account>;

// Session table
export const session = pgTable("Session", {
    sessionToken: varchar("sessionToken").notNull().unique(),
    userId: uuid("userId")
        .notNull()
        .references(() => user.id),
    expires: timestamp("expires").notNull(),
    createdAt: timestamp("createdAt").default(sql`now()`),
    updatedAt: timestamp("updatedAt")
        .default(sql`now()`)
        .$onUpdateFn(() => sql`now()`),
});

export type Session = InferSelectModel<typeof session>;

// VerificationToken table
export const verificationToken = pgTable("VerificationToken", {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull(),
    expires: timestamp("expires").notNull(),
}, (table) => ({
    compositePk: primaryKey(table.identifier, table.token),
}));

// Authenticator table
export const authenticator = pgTable("Authenticator", {
    credentialId: varchar("credentialId").notNull().unique(),
    userId: uuid("userId")
        .notNull()
        .references(() => user.id),
    providerAccountId: varchar("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: varchar("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
}, (table) => ({
    compositePk: primaryKey(table.userId, table.credentialId),
}));

// Subscription table
export const subscription = pgTable("Subscription", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("userId")
        .notNull()
        .references(() => user.id),
    tier: varchar("tier").notNull(),
    active: boolean("active").default(false),
    expiresAt: timestamp("expiresAt").notNull(),
});
export type Subscription = InferSelectModel<typeof subscription>;

// Credit table
export const credit = pgTable("Credit", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("userId")
        .notNull()
        .references(() => user.id),
    amount: integer("amount").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
});
export type Credit = InferSelectModel<typeof credit>;

// VerificationRequest table
export const verificationRequest = pgTable("VerificationRequest", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
    createdAt: timestamp("createdAt").default(sql`now()`),
    updatedAt: timestamp("updatedAt")
        .default(sql`now()`)
        .$onUpdateFn(() => sql`now()`),
});

// Relations
export const userRelations = relations(user, ({ one, many }) => ({
    accounts: many(account),
    sessions: many(session),
    authenticators: many(authenticator),
    subscriptions: many(subscription),
    credits: many(credit),
    chats: many(chat),
    documents: many(document),
    suggestions: many(suggestion),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const authenticatorRelations = relations(authenticator, ({ one }) => ({
    user: one(user, {
        fields: [authenticator.userId],
        references: [user.id],
    }),
}));

export const subscriptionRelations = relations(subscription, ({ one }) => ({
    user: one(user, {
        fields: [subscription.userId],
        references: [user.id],
    }),
}));

export const creditRelations = relations(credit, ({ one }) => ({
    user: one(user, {
        fields: [credit.userId],
        references: [user.id],
    }),
}));

export const chat = pgTable("Chat", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    userId: uuid("userId")
        .notNull()
        .references(() => user.id),
    visibility: varchar("visibility", { enum: ["public", "private"] })
        .notNull()
        .default("private"),
});
export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    chatId: uuid("chatId")
        .notNull()
        .references(() => chat.id),
    role: varchar("role").notNull(),
    content: json("content").notNull(),
    createdAt: timestamp("createdAt").notNull(),
});
export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
    "Vote",
    {
        chatId: uuid("chatId")
            .notNull()
            .references(() => chat.id),
        messageId: uuid("messageId")
            .notNull()
            .references(() => message.id),
        isUpvoted: boolean("isUpvoted").notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    })
);
export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
    "Document",
    {
        id: uuid("id").notNull().defaultRandom(),
        createdAt: timestamp("createdAt").notNull(),
        title: text("title").notNull(),
        content: text("content"),
        kind: varchar("kind", { enum: ["text", "code", "image"] })
            .notNull()
            .default("text"),
        userId: uuid("userId")
            .notNull()
            .references(() => user.id),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.id, table.createdAt] }),
    })
);
export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
    "Suggestion",
    {
        id: uuid("id").notNull().defaultRandom(),
        documentId: uuid("documentId").notNull(),
        documentCreatedAt: timestamp("documentCreatedAt").notNull(),
        originalText: text("originalText").notNull(),
        suggestedText: text("suggestedText").notNull(),
        description: text("description"),
        isResolved: boolean("isResolved").notNull().default(false),
        userId: uuid("userId")
            .notNull()
            .references(() => user.id),
        createdAt: timestamp("createdAt").notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.id] }),
        documentRef: foreignKey({
            columns: [table.documentId, table.documentCreatedAt],
            foreignColumns: [document.id, document.createdAt],
        }),
    })
);
export type Suggestion = InferSelectModel<typeof suggestion>;
