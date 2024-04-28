import Breadcrumbs from "@/components/breadcrumbs";
import Form from "@/components/configs/edit-form";
import { fetchConfigByKey } from "@/lib/data/config";
import { unstable_noStore as noStore } from "next/cache";

export default async function Page({ params }: { params: { key: string } }) {
  noStore();

  const key = params.key;
  const config = await fetchConfigByKey(key);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Configurations", href: "/configs" },
          {
            label: "Edit Configuration",
            href: `/configs/${key}/edit`,
            active: true,
          },
        ]}
      />
      <Form config={config} />
    </main>
  );
}
