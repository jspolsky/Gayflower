import { sql } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const client = sqliteTable(
    'client',
    {
        address: text('address').notNull(),
        port: text('port').notNull(),
        name: text('name').notNull().default('unassigned'),
        created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
        last_heartbeat: text('last_heartbeat').default(
            sql`(CURRENT_TIMESTAMP)`
        ),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.address, table.port] }),
    })
)

export type Client = typeof client.$inferSelect
