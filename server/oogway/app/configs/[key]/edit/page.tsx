import Breadcrumbs from "@/components/breadcrumbs";
import Form from "@/components/configs/edit-form";
import { fetchConfigByKey } from "@/lib/configs/data";

export default async function Page({ params }: { params: { key: string } }) {
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
