import { Socket } from 'net'
import { db } from '../db'
import { connection_log, ConnectionLog } from '../schema/connection-log'
import { desc } from 'drizzle-orm'

export async function fetchConnectionLog(): Promise<ConnectionLog[]> {
    try {
        const result = db
            .select()
            .from(connection_log)
            .orderBy(desc(connection_log.timestamp))

        return result
    } catch (error) {
        console.error('Database error:', error)
        throw new Error('Failed to fetch connection logs')
    }
}

export function recordConnectionLog(
    connection: Socket,
    handler_type: string,
    handler_details: string
) {
    console.log(
        `local='${connection.localAddress}:${connection.localPort}' remote='${connection.remoteAddress}:${connection.remotePort}' received ${handler_type} - ${handler_details}`
    )

    db.insert(connection_log)
        .values({
            address: connection.remoteAddress || 'undefined',
            port: String(connection.remotePort),
            handler_type,
            handler_details,
        })
        .catch(console.error)
}
