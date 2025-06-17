/* ────────────────────────────────────────────────────────────────
   Star-UPC Mentorship  –  Drizzle ORM schema  (PostgreSQL)
──────────────────────────────────────────────────────────────── */

import {
  pgTable,
  pgEnum,
  uuid,
  serial,
  text,
  integer,
  timestamp,
  time,
  date,
  jsonb,
  primaryKey,
  unique,
  index,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { AdapterAccount } from 'next-auth/adapters';



/* ───────────── ENUMs ───────────── */
export const userRoleEnum      = pgEnum('user_role',      ['MENTOR', 'ENTREPRENEUR', 'ADMIN']);
export const bookingStatusEnum = pgEnum('booking_status', ['BOOKED', 'COMPLETED', 'CANCELLED']);

/* ───────────── Users ───────────── */
export const users = pgTable('users', {
  id            : uuid('id').defaultRandom().primaryKey(),
  email         : text('email').notNull().unique(),
  name          : text('name'),
  image         : text('image'),  // Auth.js avatar
  emailVerified : timestamp('email_verified', { withTimezone: true }),
  password      : text('password'),   // optional hashed password for local login
  invalidLoginAttempts: integer('invalid_login_attempts').default(0).notNull(),
  lockedAt    : timestamp('locked_at', { withTimezone: true }),
  role          : userRoleEnum('role').notNull(),
  createdAt     : timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ───────────── NextAuth tables ───────────── */

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

/* ───────────── Mentor availability ───────────── */
export const mentorAvailability = pgTable(
  'mentor_availability',
  {
    id        : serial('id').primaryKey(),
    mentorId  : uuid('mentor_id').notNull()
                 .references(() => users.id, { onDelete: 'cascade' }),
    weekday   : integer('weekday').notNull(), // 0-6 for Sunday to Saturday
    startTime : time('start_time').notNull(),
    endTime   : time('end_time').notNull(),
    startDate : date('start_date'),
    endDate   : date('end_date'),
    createdAt : timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniq : unique('uq_availability_mentor_weekday_time')
             .on(t.mentorId, t.weekday, t.startTime),
    mentorIdx : index('idx_availability_mentor').on(t.mentorId),
  }),
);

/* ───────────── Bookings ───────────── */
export const bookings = pgTable(
  'bookings',
  {
    id             : uuid('id').defaultRandom().primaryKey(),
    mentorId       : uuid('mentor_id').notNull()
                      .references(() => users.id, { onDelete: 'cascade' }),
    entrepreneurId : uuid('entrepreneur_id').notNull()
                      .references(() => users.id, { onDelete: 'cascade' }),
    startTime      : timestamp('start_time', { withTimezone: true }).notNull(),
    endTime        : timestamp('end_time',   { withTimezone: true }).notNull(),
    status         : bookingStatusEnum('status').default('BOOKED').notNull(),
    creditCost     : integer('credit_cost').default(1).notNull(),
    createdAt      : timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt      : timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    mentorIdx : index('idx_booking_mentor_time').on(t.mentorId, t.startTime),
    entIdx    : index('idx_booking_ent_time').on(t.entrepreneurId, t.startTime),
  }),
);

/* ───────────── Feedback & report ───────────── */
export const sessionFeedback = pgTable('session_feedback', {
  id                  : serial('id').primaryKey(),
  bookingId           : uuid('booking_id').notNull()
                          .references(() => bookings.id, { onDelete: 'cascade' })
                          .unique(),
  mentorRating        : integer('mentor_rating'), // 1-5 rating
  entrepreneurRating  : integer('entrepreneur_rating'), // 1-5 rating
  report              : jsonb('report').notNull(),
  submittedAt         : timestamp('submitted_at', { withTimezone: true }).defaultNow(),
});

/* ───────────── Credit ledger ───────────── */
export const creditTransactions = pgTable(
  'credit_transactions',
  {
    id             : serial('id').primaryKey(),
    entrepreneurId : uuid('entrepreneur_id').notNull()
                      .references(() => users.id, { onDelete: 'cascade' }),
    amount         : integer('amount').notNull(), // +ve for credits, -ve for consumption
    reason         : text('reason'),
    bookingId      : uuid('booking_id').references(() => bookings.id),
    createdBy      : uuid('created_by').references(() => users.id),
    createdAt      : timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    entIdx: index('idx_credit_ent').on(t.entrepreneurId),
  }),
);

/* ───────────── Relations ───────────── */
export const usersRelations = relations(users, ({ many }) => ({
  availabilities     : many(mentorAvailability),
  mentorBookings     : many(bookings, { relationName: 'mentor' }),
  entrepreneurBookings: many(bookings, { relationName: 'entrepreneur' }),
  creditTransactions : many(creditTransactions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const mentorAvailabilityRelations = relations(mentorAvailability, ({ one }) => ({
  mentor: one(users, { fields: [mentorAvailability.mentorId], references: [users.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  mentor       : one(users, { relationName: 'mentor', fields: [bookings.mentorId], references: [users.id] }),
  entrepreneur : one(users, { relationName: 'entrepreneur', fields: [bookings.entrepreneurId], references: [users.id] }),
  feedback     : one(sessionFeedback),
  creditTxn    : one(creditTransactions),
}));

export const sessionFeedbackRelations = relations(sessionFeedback, ({ one }) => ({
  booking: one(bookings, { fields: [sessionFeedback.bookingId], references: [bookings.id] }),
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  entrepreneur: one(users, { fields: [creditTransactions.entrepreneurId], references: [users.id] }),
  booking     : one(bookings, { fields: [creditTransactions.bookingId], references: [bookings.id] }),
  admin       : one(users, { fields: [creditTransactions.createdBy], references: [users.id] }),
}));

/* ───────────── Drizzle-Kit migration tip ─────────────
   npx drizzle-kit generate && npx drizzle-kit push
────────────────────────────────────────────────────── */
