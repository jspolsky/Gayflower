"use client";

import * as schema from "@/lib/schema";
import Link from "next/link";
import { updateConfig } from "@/lib/configs/actions";
import { Button } from "../button";

export default function EditConfigForm({ config }: { config: schema.Config }) {
  const updateConfigWithId = updateConfig.bind(null, config.key);
  return (
    <form action={updateConfigWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Config Key */}
        <div className="mb-4">
          <label htmlFor="configKey" className="mb-2 block text-sm font-medium">
            Choose a key
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="configKey"
                name="configKey"
                type="text"
                defaultValue={config.key}
                placeholder="Enter id"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Config Value */}
        <div className="mb-4">
          <label
            htmlFor="configValue"
            className="mb-2 block text-sm font-medium"
          >
            Choose a value
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="configValue"
                name="configValue"
                type="text"
                defaultValue={config.value}
                placeholder="Enter value"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/configs"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Config</Button>
      </div>
    </form>
  );
}
