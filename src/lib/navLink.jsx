"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

// Simple NavLink replacement for Next.js App Router
export function NavLink({ to, children, className, end, onClick, onMouseEnter, ...props }) {
  const pathname = usePathname();
  const isActive = end
    ? pathname === to
    : pathname.startsWith(to) && (end || pathname === to || pathname.startsWith(to + "/") || pathname.startsWith(to + "#"));

  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;

  return (
    <NextLink
      href={to}
      className={resolvedClassName}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      {...props}
    >
      {typeof children === "function" ? children({ isActive }) : children}
    </NextLink>
  );
}

export { NextLink as Link };
