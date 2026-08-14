import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// DELETE /api/tests/5 -> removes that test (and its subject results, via cascade)
export async function DELETE(request, { params }) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await prisma.test.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
