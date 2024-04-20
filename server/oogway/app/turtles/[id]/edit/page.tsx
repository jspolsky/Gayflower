import Breadcrumbs from "@/components/turtles/breadcrumbs";
import Form from "@/components/turtles/edit-form";
import { fetchTurtleById } from "@/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const turtle = await fetchTurtleById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Turtles", href: "/turtles" },
          {
            label: "Edit Turtle",
            href: `/turtles/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form turtle={turtle} />
    </main>
  );
}
