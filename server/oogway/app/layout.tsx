import Links from "@/components/Links";
import { inter } from "@/components/fonts";

export const metadata = {
  title: "Oogway",
  description:
    '"Your mind is like this water, my friend. When it is agitated, it becomes difficult to see. But if you allow it to settle, the answer becomes clear." - Grand Master Oogway',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full bg-gray-100">
      <body className={`h-full ${inter.className} antialiased`}>
        <Links />
        {children}
      </body>
    </html>
  );
}
