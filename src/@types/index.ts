import { users, properties } from "../model/schema"

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

export type JWTPaylod = {
    user: {
        id: number;
        email: string
        username: string
        created_at: Date | string
        updatetd_at?: Date | string
    }
}

export type Query = {
    page: number;
    limit: number
    start_date: string;
    end_date: string
}

export type Metadata = {
    page: number;
    limit: number;
    from: number;
    to: number;
    total_row: number;
}

export type Success<T> = {
    status: number
    data: T;
    meta?: Metadata
    message: string;
}
export type Error = {
    status: number;
    type: string;
    message?: string;
    errors?: unknown;
}

