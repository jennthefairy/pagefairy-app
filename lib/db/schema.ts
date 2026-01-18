import { pgTable, text, timestamp, integer, boolean, decimal, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// ========================================
// USERS (Creators)
// ========================================
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => `usr_${nanoid()}`),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  name: text('name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  passwordHash: text('password_hash').notNull(),
  emailVerified: boolean('email_verified').default(false),
  stripeAccountId: text('stripe_account_id'), // For payouts
  // Brand Assets
  logo: text('logo'),
  brandColor: text('brand_color'),
  typography: text('typography'),
  theme: text('theme'),
  // Social Links
  instagram: text('instagram'),
  twitter: text('twitter'),
  tiktok: text('tiktok'),
  youtube: text('youtube'),
  linkedin: text('linkedin'),
  // Domain Settings
  slug: text('slug').unique(),
  customDomain: text('custom_domain'),
  domainType: text('domain_type'), // 'subdomain' or 'custom'
  // Regional Settings
  targetCountries: json('target_countries').$type<string[]>(),
  language: text('language').default('en'),
  timezone: text('timezone').default('America/New_York'),
  dateOfBirth: text('date_of_birth'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  payouts: many(payouts),
}));

// ========================================
// PRODUCTS (Lashes)
// ========================================
export const products = pgTable('products', {
  id: text('id').primaryKey().$defaultFn(() => `prd_${nanoid()}`),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  aiGeneratedDescription: text('ai_generated_description'), // AI-generated version
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  lashType: text('lash_type'), // natural, dramatic, wispy, cat-eye, etc.
  features: json('features').$type<string[]>(), // Array of features
  status: text('status').notNull().default('draft'), // draft, active, ended
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  drops: many(drops),
}));

// ========================================
// DROPS (Pre-order Campaigns)
// ========================================
export const drops = pgTable('drops', {
  id: text('id').primaryKey().$defaultFn(() => `drp_${nanoid()}`),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  minOrders: integer('min_orders').notNull().default(10), // Minimum orders to proceed
  currentOrders: integer('current_orders').notNull().default(0),
  status: text('status').notNull().default('active'), // active, completed, cancelled
  endsAt: timestamp('ends_at'), // Optional deadline
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dropsRelations = relations(drops, ({ one, many }) => ({
  product: one(products, {
    fields: [drops.productId],
    references: [products.id],
  }),
  orders: many(orders),
  boostCampaign: one(boostCampaigns),
}));

// ========================================
// ORDERS
// ========================================
export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => `ord_${nanoid()}`),
  dropId: text('drop_id').references(() => drops.id, { onDelete: 'cascade' }), // Optional: for drop-based orders
  productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }), // For direct product orders
  creatorId: text('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // pending, paid, processing, shipped, delivered, refunded, cancelled, failed
  stripeSessionId: text('stripe_session_id').unique(), // Checkout session ID
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(), // Payment intent ID (set after payment)
  stripePaymentStatus: text('stripe_payment_status'), // succeeded, pending, failed
  shippingAddress: json('shipping_address').$type<{
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }>(),
  trackingNumber: text('tracking_number'),
  refundedAt: timestamp('refunded_at'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  drop: one(drops, {
    fields: [orders.dropId],
    references: [drops.id],
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  creator: one(users, {
    fields: [orders.creatorId],
    references: [users.id],
  }),
}));

// ========================================
// PAYOUTS (Creator Earnings)
// ========================================
export const payouts = pgTable('payouts', {
  id: text('id').primaryKey().$defaultFn(() => `pay_${nanoid()}`),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orderId: text('order_id').references(() => orders.id, { onDelete: 'cascade' }), // Link to specific order
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // pending, processing, paid, failed, cancelled
  stripeTransferId: text('stripe_transfer_id'),
  metadata: json('metadata').$type<{
    dropId?: string;
    ordersCount?: number;
  }>(),
  failureReason: text('failure_reason'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payoutsRelations = relations(payouts, ({ one }) => ({
  user: one(users, {
    fields: [payouts.userId],
    references: [users.id],
  }),
}));

// ========================================
// BOOST CAMPAIGNS (Paid Ads)
// ========================================
export const boostCampaigns = pgTable('boost_campaigns', {
  id: text('id').primaryKey().$defaultFn(() => `bst_${nanoid()}`),
  dropId: text('drop_id').notNull().unique().references(() => drops.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(), // Budget
  status: text('status').notNull().default('active'), // active, paused, ended
  impressions: integer('impressions').notNull().default(0),
  clicks: integer('clicks').notNull().default(0),
  conversions: integer('conversions').notNull().default(0), // Orders from boost
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const boostCampaignsRelations = relations(boostCampaigns, ({ one }) => ({
  drop: one(drops, {
    fields: [boostCampaigns.dropId],
    references: [drops.id],
  }),
}));

// ========================================
// FEATURED CREATORS
// ========================================
export const featuredCreators = pgTable('featured_creators', {
  id: text('id').primaryKey().$defaultFn(() => `ftr_${nanoid()}`),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('active'), // active, ended
  priority: integer('priority').notNull().default(0), // Higher = shown first
  featuredAt: timestamp('featured_at').defaultNow().notNull(),
  endsAt: timestamp('ends_at'),
});

// ========================================
// TYPES (for TypeScript)
// ========================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Drop = typeof drops.$inferSelect;
export type NewDrop = typeof drops.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type Payout = typeof payouts.$inferSelect;
export type NewPayout = typeof payouts.$inferInsert;

export type BoostCampaign = typeof boostCampaigns.$inferSelect;
export type NewBoostCampaign = typeof boostCampaigns.$inferInsert;

export type FeaturedCreator = typeof featuredCreators.$inferSelect;
export type NewFeaturedCreator = typeof featuredCreators.$inferInsert;
