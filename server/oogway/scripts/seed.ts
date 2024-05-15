import { db } from '../lib/db'
import * as configSchema from '../lib/schema/config'

await db.insert(configSchema.config).values(
    configSchema.ALL_KNOWN_CONFIGS.map((c) => ({
        key: c.key,
        value: String(c.defaultValue),
    }))
)

console.log(`Seeding complete.`)
