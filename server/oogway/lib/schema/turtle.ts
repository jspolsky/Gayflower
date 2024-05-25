import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const UNASSIGNED_TURTLE_NAME = 'UNASSIGNED'

export const turtle = sqliteTable('turtle', {
    id: text('id').primaryKey(),
    name: text('name').notNull().default(UNASSIGNED_TURTLE_NAME),
    enabled: integer('enabled', { mode: 'boolean' }).notNull().default(false),
    watermaster: integer('watermaster', { mode: 'boolean' })
        .notNull()
        .default(false),
    created_at: text('timestamp')
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
})

export type Turtle = typeof turtle.$inferSelect
export type NewTurtle = typeof turtle.$inferInsert
export type TurtleWithStats = Turtle & {
    successful_swipe_count: number
    failed_swipe_count: number
}
