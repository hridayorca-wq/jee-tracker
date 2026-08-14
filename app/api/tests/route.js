import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateScore, unattempted } from "@/lib/scoring";
import { isAuthenticated } from "@/lib/auth";

// GET /api/tests -> returns every test, newest first, with subject results
export async function GET() {
  const tests = await prisma.test.findMany({
    include: { results: true },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(tests);
}

// POST /api/tests -> creates a new test with 3 subject results
// Expected body:
// {
//   name: "JEE Main Mock 5",
//   date: "2026-08-10",
//   subjects: {
//     Physics:   { mcqCorrect, mcqWrong, numCorrect, numWrong },
//     Chemistry: { mcqCorrect, mcqWrong, numCorrect, numWrong },
//     Maths:     { mcqCorrect, mcqWrong, numCorrect, numWrong }
//   }
// }
export async function POST(request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name || !body.subjects) {
    return NextResponse.json(
      { error: "Missing test name or subject data" },
      { status: 400 }
    );
  }

  const subjectNames = ["Physics", "Chemistry", "Maths"];

  const resultsData = subjectNames.map((subject) => {
    const s = body.subjects[subject] || {};
    const mcqCorrect = Number(s.mcqCorrect) || 0;
    const mcqWrong = Number(s.mcqWrong) || 0;
    const numCorrect = Number(s.numCorrect) || 0;
    const numWrong = Number(s.numWrong) || 0;

    const { mcqUnattempted, numUnattempted } = unattempted({
      mcqCorrect,
      mcqWrong,
      numCorrect,
      numWrong,
    });

    const score = calculateScore({ mcqCorrect, mcqWrong, numCorrect, numWrong });

    return {
      subject,
      mcqCorrect,
      mcqWrong,
      mcqUnattempted,
      numCorrect,
      numWrong,
      numUnattempted,
      score,
    };
  });

  const test = await prisma.test.create({
    data: {
      name: body.name,
      examType: body.examType || "JEE Main",
      notes: body.notes || null,
      date: body.date ? new Date(body.date) : new Date(),
      results: { create: resultsData },
    },
    include: { results: true },
  });

  return NextResponse.json(test, { status: 201 });
}
