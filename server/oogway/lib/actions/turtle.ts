'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import { db } from '../db'
import * as schema from '../schema/turtle'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

const TurtleSchema = z.object({
    id: z.string(),
    name: z.string(),
    enabled: z.coerce.boolean(),
})

const UpdateTurtleSchema = TurtleSchema.omit({ id: true })

export async function updateTurtle(
    id: string,
    enabled: boolean,
    formData: FormData
) {
    const { name } = UpdateTurtleSchema.parse({
        name: formData.get('turtleName'),
    })

    await db
        .update(schema.turtle)
        .set({ name: name, enabled: enabled })
        .where(eq(schema.turtle.id, id))
        .returning({ newName: schema.turtle.name })

    revalidatePath('/')
}

export async function deleteTurtle(id: string) {
    await db.delete(schema.turtle).where(eq(schema.turtle.id, id))
    revalidatePath('/')
    redirect('/')
}
