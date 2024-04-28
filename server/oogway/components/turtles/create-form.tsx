import Link from "next/link";
import { createTurtle } from "@/lib/actions/turtle";
import { Button } from "../button";

export default function CreateTurtleForm() {
  return (
    <form action={createTurtle}>
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
              placeholder="Enter id"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Turtle Name */}
      <div className="mb-4">
        <label htmlFor="turtleName" className="mb-2 block text-sm font-medium">
          Choose a name
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="turtleName"
              name="turtleName"
              type="text"
              placeholder="Enter name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
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
        <Button type="submit">Create Turtle</Button>
      </div>
    </form>
  );
}
