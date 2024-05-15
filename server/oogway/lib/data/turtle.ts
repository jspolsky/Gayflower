import { like, sql, or, eq, count } from 'drizzle-orm'
import { db } from '../db'
import { turtle, Turtle, UNASSIGNED_TURTLE_NAME } from '../schema/turtle'
import { swipe_log } from '../schema/swipe-log'

export async function fetchTurtlesWithStats(): Promise<
    (Turtle & {
        successful_swipe_count: number
        failed_swipe_count: number
    })[]
> {
    try {
        const result = await db
            .select({
                id: turtle.id,
                name: turtle.name,
                enabled: turtle.enabled,
                created_at: turtle.created_at,
                successful_swipe_count: sql<number>`cast(count(iif(${swipe_log.is_allowed} = 1, 1, null)) as int)`,
                failed_swipe_count: sql<number>`cast(count(iif(${swipe_log.is_allowed} = 0, 1, null)) as int)`,
            })
            .from(turtle)
            .leftJoin(swipe_log, eq(turtle.id, swipe_log.swipe_id))
            .groupBy(turtle.id)

        return result
    } catch (error) {
        console.error('Database error:', error)
        throw new Error('Failed to fetch Filtered Turtles with stats')
    }
}

export async function fetchUnassignedTurtles(): Promise<Turtle[]> {
    const result = await db
        .select()
        .from(turtle)
        .where(eq(turtle.name, UNASSIGNED_TURTLE_NAME))
    return result
}

export async function fetchTurtleById(id: string): Promise<Turtle> {
    const result = await db.select().from(turtle).where(eq(turtle.id, id))

    if (result[0]) return result[0]
    else throw new Error(`Turtle with id ${id} doesn't exist`)
}

export async function fetchOrAddTurtle(id: string): Promise<Turtle> {
    const selectResult = await db.select().from(turtle).where(eq(turtle.id, id))
    if (selectResult[0]) return selectResult[0]

    const insertResult = await db.insert(turtle).values({ id }).returning()

    if (insertResult[0]) return insertResult[0]
    else throw new Error(`Failed fetchOrAddTurtle with id ${id}`)
}
