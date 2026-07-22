"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

// NavLink replacement for Next.js App Router - accepts `to` prop like react-router-dom
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

// Link wrapper that converts `to` prop (react-router-dom style) to `href` (Next.js style)
export function Link({ to, href, children, ...props }) {
  return (
    <NextLink href={to || href} {...props}>
      {children}
    </NextLink>
  );
}
