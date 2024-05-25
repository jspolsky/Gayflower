import { Socket } from 'net'
import { swipe_log } from '../schema/swipe-log'
import { db } from '../db'
import { desc, eq } from 'drizzle-orm'

export async function fetchSwipeLogs() {
    try {
        const result = db
            .select()
            .from(swipe_log)
            .orderBy(desc(swipe_log.timestamp))

        return result
    } catch (error) {
        console.error('Database error:', error)
        throw new Error('Failed to fetch swipe logs')
    }
}

export async function fetchSwipeLogsForTurtle(id: string) {
    try {
        const result = db
            .select()
            .from(swipe_log)
            .where(eq(swipe_log.swipe_id, id))
            .orderBy(desc(swipe_log.timestamp))

        return result
    } catch (error) {
        console.error('Database error:', error)
        throw new Error(`Failed to fetch swipe logs for id ${id}`)
    }
}

export function recordSwipeLog(
    connection: Socket,
    swipe_id: string,
    is_allowed: boolean,
    reason: string
) {
    console.log(
        `local='${connection.localAddress}:${connection.localPort}' remote='${connection.remoteAddress}:${connection.remotePort}' swipe_id='${swipe_id}' is_allowed='${is_allowed}' reason='${reason}'`
    )
    db.insert(swipe_log)
        .values({
            address: connection.remoteAddress || 'undefined',
            port: String(connection.remotePort),
            swipe_id,
            is_allowed,
            reason,
        })
        .catch(console.error)
}
