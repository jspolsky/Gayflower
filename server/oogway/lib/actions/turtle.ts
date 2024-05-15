'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import { redirect } from 'next/navigation'
import { db } from '../db'
import * as schema from '../schema/turtle'
import { eq } from 'drizzle-orm'

const TurtleSchema = z.object({
    id: z.string(),
    name: z.string(),
    enabled: z.coerce.boolean(),
})

const UpdateTurtleSchema = TurtleSchema.omit({ id: true })

export async function createTurtle(formData: FormData) {
    const { id, name, enabled } = TurtleSchema.parse({
        id: formData.get('turtleId'),
        name: formData.get('turtleName'),
        enabled: formData.get('isEnabled'),
    })

    await db.insert(schema.turtle).values([{ id, name, enabled }])

    revalidatePath('/turtles')
    redirect('/turtles')
}

export async function updateTurtle(id: string, formData: FormData) {
    const { name, enabled } = UpdateTurtleSchema.parse({
        name: formData.get('turtleName'),
        enabled: formData.get('isEnabled'),
    })

    await db
        .update(schema.turtle)
        .set({ name: name, enabled: enabled })
        .where(eq(schema.turtle.id, id))
        .returning({ newName: schema.turtle.name })

    revalidatePath('/turtles')
    redirect('/turtles')
}

export async function deleteTurtle(id: string) {
    await db.delete(schema.turtle).where(eq(schema.turtle.id, id))
    revalidatePath('/turtles')
}
