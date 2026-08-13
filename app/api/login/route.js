import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();

  if (!process.env.SITE_PASSWORD) {
    return NextResponse.json(
      { error: "Server isn't configured with a password yet." },
      { status: 500 }
    );
  }

  if (password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("site_auth", process.env.SITE_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // stay logged in for 30 days
    path: "/",
  });
  return response;
}
