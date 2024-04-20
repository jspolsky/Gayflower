import { eq } from "drizzle-orm";
import * as schema from "../schema";
import { db } from "../db";

enum ConfigKey {
  PUMP_TIME_IN_SECONDS = "PUMP_TIME_IN_SECONDS",
}

export type Config<T> = {
  key: ConfigKey;
  description: string;
  defaultValue: T;
};

export const PUMP_TIME_IN_SECONDS_CONFIG: Config<Number> = {
  key: ConfigKey.PUMP_TIME_IN_SECONDS,
  description: "Pump time in seconds",
  defaultValue: 90,
};

export async function getConfigValueOrDefault<T>(config: Config<T>) {
  try {
    const result = await db
      .select()
      .from(schema.configs)
      .where(eq(schema.configs.key, config.key));

    const value = result[0].value;

    return value as T;
  } catch (error) {
    console.error(
      "Failed to get config and will use default value",
      config,
      error
    );
    return config.defaultValue;
  }
}
