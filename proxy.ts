import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  // For demo, let everything through except governance
  const path = req.nextUrl.pathname;
  if (path.startsWith("/governance") || path.startsWith("/admin")) {
    // In prod, check token here
    return NextResponse.next();
  }
  return NextResponse.next();
}

// CRITICAL: Only run proxy on governance/admin — NOT upload/analysis
export const config = {
  matcher: ["/governance/:path*", "/admin/:path*"],
};