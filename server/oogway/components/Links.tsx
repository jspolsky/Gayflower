"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Links() {
  const pathname = usePathname();

  return (
    <nav>
      <ul>
        <li>
          <Link className={`link ${pathname === "/" ? "active" : ""}`} href="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === "/turtles" ? "active" : ""}`}
            href="/turtles"
          >
            Turtles
          </Link>
        </li>
      </ul>
    </nav>
  );
}
