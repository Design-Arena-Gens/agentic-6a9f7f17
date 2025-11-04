"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/projects", label: "Projects" },
  { href: "/categories", label: "Categories" },
  { href: "/vendors", label: "Vendors" },
  { href: "/reports", label: "Reports" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-4 py-3">
          <div className="font-semibold text-lg">Construction Expense Manager</div>
          <div className="ml-auto flex gap-2 sm:gap-4 text-sm">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    "px-2 py-1 rounded-md hover:bg-gray-100 transition-colors" +
                    (active ? " bg-gray-100 font-medium" : "")
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
