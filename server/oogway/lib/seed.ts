import { db } from "./db";
import * as schema from "./schema";

// await db.insert(schema.turtles).values([
//   { id: 100001, name: "Leonardo" },
//   { id: 100002, name: "Raphael" },
//   { id: 100003, name: "Donatello" },
//   { id: 100004, name: "Michelangelo" },
// ]);

// await db.insert(schema.configs).values([
//   { key: "key1", value: "value1" },
//   { key: "key2", value: "value2" },
//   { key: "key3", value: "value3" },
//   { key: "key4", value: "value4" },
// ]);
console.log(`Seeding complete.`);
