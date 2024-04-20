import Breadcrumbs from "@/components/turtles/breadcrumbs";
import Form from "@/components/turtles/create-form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Turtles", href: "/turtles" },
          {
            label: "Create Turtle",
            href: "/turtles/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
