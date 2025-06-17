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
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccount } from 'next-auth/adapters';


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
  googleId      : text('google_id'),  // optional quick link
  role          : userRoleEnum('role').notNull(),
  createdAt     : timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ───────────── NextAuth tables ───────────── */

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').notNull()
                    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccount['type']>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
}, (t) => [
    index('idx_accounts_user').on(t.userId),
]);

export const sessions = pgTable('sessions', {
  sessionToken : text('session_token').primaryKey(),
  userId       : uuid('user_id').notNull()
                   .references(() => users.id, { onDelete: 'cascade' }),
  expires      : timestamp('expires', { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier : text('identifier').notNull(),
    token      : text('token').notNull(),
    expires    : timestamp('expires', { withTimezone: true }).notNull(),
  },
  (vt) => ({
    pk: primaryKey(vt.identifier, vt.token),
  }),
);

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
