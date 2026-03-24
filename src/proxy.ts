import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  type Role,
  hasMinRole,
  PROTECTED_ROUTES,
  AUTH_ROUTES,
} from "@/lib/permissions";

export default auth(async (req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const userRole = (session?.user?.role ?? "STUDENT") as Role;

  // Redirigir usuarios autenticados de la landing al dashboard
  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirigir usuarios autenticados fuera de login/register
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Verificar rutas protegidas
  const matchedRoute = PROTECTED_ROUTES.find((r) =>
    pathname.startsWith(r.prefix)
  );

  if (matchedRoute) {
    // No autenticado → al login
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Autenticado pero sin el rol suficiente → al dashboard
    if (!hasMinRole(userRole, matchedRoute.minRole)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};
