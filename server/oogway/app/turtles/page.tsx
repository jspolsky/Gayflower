import { CreateTurtle } from "@/components/turtles/buttons";
import Table from "@/components/turtles/table";
import { unstable_noStore as noStore } from "next/cache";

export default async function Page() {
  noStore();
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Turtles</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateTurtle />
      </div>
      <Table />
    </div>
  );
}
