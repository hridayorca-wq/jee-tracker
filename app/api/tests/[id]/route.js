import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/tests/5 -> removes that test (and its subject results, via cascade)
export async function DELETE(request, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await prisma.test.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
