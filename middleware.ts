import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {

  const { supabase, response } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase.from("user").select("*").eq("id", user.id);
    if (data && data.length > 0) {
      return response;
    }
  }
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/login";
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/all",
    "/all/:path*",
    "/explore",
    "/explore",
    "/create",
    "/edit/:path*",
    "/notifications",
    "/settings",
    "/messages",
    "/quote/:path*",
    "/myself",
    "/quickies",
    "/quickies/:path*",
    "/setupresume",
    "/editresume",
    "/more/:path*",
    "/hashtag/:path*",
    "/bookmarks",
    "/posts/:path*",
    "/search/bookmarks/:path*",
    "/search/posts/:path*",
    "/search/quickies/:path*",
    "/search/people/:path*",
  ],
};
