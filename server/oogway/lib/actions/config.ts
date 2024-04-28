"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";
import { db } from "../db";
import * as schema from "../schema/config";
import { eq } from "drizzle-orm";

const ConfigurationSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const UpdateConfigurationSchema = ConfigurationSchema.omit({ key: true });

export async function createConfig(formData: FormData) {
  const { key, value } = ConfigurationSchema.parse({
    key: formData.get("configKey"),
    value: formData.get("configValue"),
  });

  await db.insert(schema.config).values([{ key, value }]);

  revalidatePath("/configs");
  redirect("/configs");
}

export async function updateConfig(key: string, formData: FormData) {
  const { value } = UpdateConfigurationSchema.parse({
    value: formData.get("configValue"),
  });

  await db
    .update(schema.config)
    .set({ value: value })
    .where(eq(schema.config.key, key))
    .returning({ newValue: schema.config.value });

  revalidatePath("/configs");
  redirect("/configs");
}

export async function deleteConfig(key: string) {
  await db.delete(schema.config).where(eq(schema.config.key, key));
  revalidatePath("/configs");
}
