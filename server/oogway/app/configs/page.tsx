import { CreateConfig } from "@/components/configs/buttons";
import Table from "@/components/configs/table";
import { unstable_noStore as noStore } from "next/cache";

export default async function Page() {
  noStore();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Configurations</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateConfig />
      </div>
      <Table />
    </div>
  );
}
