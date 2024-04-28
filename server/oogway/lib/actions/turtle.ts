"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";
import { db } from "../db";
import * as schema from "../schema/turtle";
import { eq } from "drizzle-orm";

const TurtleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const UpdateTurtleSchema = TurtleSchema.omit({ id: true });

export async function createTurtle(formData: FormData) {
  const { id, name } = TurtleSchema.parse({
    id: formData.get("turtleId"),
    name: formData.get("turtleName"),
  });

  await db.insert(schema.turtle).values([{ id, name }]);

  revalidatePath("/turtles");
  redirect("/turtles");
}

export async function updateTurtle(id: string, formData: FormData) {
  const { name } = UpdateTurtleSchema.parse({
    name: formData.get("turtleName"),
  });

  await db
    .update(schema.turtle)
    .set({ name: name })
    .where(eq(schema.turtle.id, id))
    .returning({ newName: schema.turtle.name });

  revalidatePath("/turtles");
  redirect("/turtles");
}

export async function deleteTurtle(id: string) {
  await db.delete(schema.turtle).where(eq(schema.turtle.id, id));
  revalidatePath("/turtles");
}
