import { Socket } from 'net'
import * as schema from '../schema/swipe-log'
import { db } from '../db'

export async function fetchSwipeLogs() {
    try {
        const result = db.select().from(schema.swipe_log)

        return result
    } catch (error) {
        console.error('Database error:', error)
        throw new Error('Failed to fetch swipe logs')
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
    db.insert(schema.swipe_log)
        .values({
            address: connection.remoteAddress || 'undefined',
            port: String(connection.remotePort),
            swipe_id,
            is_allowed,
            reason,
        })
        .catch(console.error)
}
