import {
    mysqlTable, int,
    varchar, text, timestamp, mysqlEnum
} from 'drizzle-orm/mysql-core';

const USERS = "users" as const;
const PROPERTIES = "properties" as const;
const BOOKINGS = "bookings" as const;
const ROLES = ["ADMIN", "MEMBER"] as const

export const users = mysqlTable(USERS, {
    id: varchar("id", { length: 16 }).primaryKey(),
    username: varchar("username", { length: 225 }).notNull(),
    password: varchar("password", { length: 225 }).notNull(),
    role: mysqlEnum("role", ROLES).default("MEMBER"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow()
})

export const properties = mysqlTable(PROPERTIES, {
    id: varchar("id", { length: 16 }).primaryKey(),
    type: int("type",).notNull(),
    price: int("price").notNull(),
    thumbnail_url: text("thumbnail_url").notNull(),
    view_url: text("view_url").notNull(),
    address: text("address").notNull(),
    description: text("description").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow()
})


// export const bookings = mysqlTable(BOOKINGS, {
//     id: varchar("id", { length: 16 }).primaryKey(),

// })


