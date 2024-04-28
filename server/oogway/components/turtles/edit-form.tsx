"use client";

import * as schema from "@/lib/schema/turtle";
import Link from "next/link";
import { updateTurtle } from "@/lib/actions/turtle";
import { Button } from "../button";

export default function EditTurtleForm({
  turtle,
}: {
  turtle: schema.NewTurtle;
}) {
  const updateTurtleWithId = updateTurtle.bind(null, turtle.id);
  return (
    <form action={updateTurtleWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Turtle ID */}
        <div className="mb-4">
          <label htmlFor="turtleId" className="mb-2 block text-sm font-medium">
            Choose an id
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="turtleId"
                name="turtleId"
                type="text"
                defaultValue={turtle.id}
                placeholder="Enter id"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Turtle Name */}
        <div className="mb-4">
          <label
            htmlFor="turtleName"
            className="mb-2 block text-sm font-medium"
          >
            Choose a name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="turtleName"
                name="turtleName"
                type="text"
                defaultValue={turtle.name}
                placeholder="Enter id"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/turtles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Turtle</Button>
      </div>
    </form>
  );
}
