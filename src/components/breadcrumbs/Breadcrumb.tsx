import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight2 } from "iconsax-react";

import { useMe } from "../../hooks/auth/useAuth";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({
  items = [{ label: "Dashboard", path: "/" }],
}: BreadcrumbProps) {
  // Mengambil data user yang sedang login
  const { data: meResponse, isLoading } = useMe();

  const user = meResponse?.data;

  // Membuat inisial otomatis dari nama user
  const initials =
    user?.fullName
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  // Mengambil nama role dari backend
  const userRole = user?.role?.name
    ?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={`${item.label}-${index}`}
                className="flex shrink-0 items-center gap-2"
              >
                {isLast || !item.path ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={
                      isLast
                        ? "font-semibold text-gray-900"
                        : "font-medium text-gray-500"
                    }
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="font-medium text-gray-500 transition-colors hover:text-blue-700"
                  >
                    {item.label}
                  </Link>
                )}

                {!isLast && (
                  <ArrowRight2 size={14} color="#9CA3AF" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* User Profile */}
      <div className="ml-4 flex shrink-0 items-center gap-2">
        {isLoading ? (
          <>
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
            <div className="hidden space-y-1 sm:block">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-2.5 w-28 animate-pulse rounded bg-gray-200" />
            </div>
          </>
        ) : (
          <>
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-black">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-white">{initials}</span>
              )}
            </div>

            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-gray-800">
                {user?.fullName || "Pengguna"}
              </h2>

              <p className="text-xs tracking-wide text-gray-500">
                {userRole || "Pengguna"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
