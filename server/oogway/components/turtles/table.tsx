import { UpdateTurtle, DeleteTurtle } from "@/components/turtles/buttons";
import { fetchTurtlesWithStats } from "@/lib/data/turtle";
import { unstable_noStore as noStore } from "next/cache";

export default async function TurtlesTable() {
  noStore();
  const turtles = await fetchTurtlesWithStats();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {turtles?.map((turtle) => (
              <div
                key={turtle.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{turtle.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{turtle.name}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateTurtle id={turtle.id} />
                    <DeleteTurtle id={turtle.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Enabled?
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Successful Swipe Count
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Failed Swipe Count
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {turtles?.map((turtle) => (
                <tr
                  key={turtle.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{turtle.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{turtle.name}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {String(turtle.enabled)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {turtle.successful_swipe_count}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {turtle.failed_swipe_count}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTurtle id={turtle.id} />
                      <DeleteTurtle id={turtle.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
