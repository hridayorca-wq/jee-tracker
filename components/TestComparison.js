"use client";

const SUBJECTS = ["Physics", "Chemistry", "Maths"];

function subjectTotals(test) {
  const out = {};
  for (const subject of SUBJECTS) {
    const r = test.results.find((res) => res.subject === subject);
    out[subject] = {
      score: r ? r.score : 0,
      correct: r ? r.mcqCorrect + r.numCorrect : 0,
      unattempted: r ? r.mcqUnattempted + r.numUnattempted : 0,
    };
  }
  return out;
}

function Diff({ value, suffix = "" }) {
  if (value === 0) return <span className="text-slate-500">no change</span>;
  const up = value > 0;
  return (
    <span className={up ? "text-green-600" : "text-red-500"}>
      {up ? "▲" : "▼"} {Math.abs(value)}
      {suffix}
    </span>
  );
}

// Compares the two most recent tests and gives a plain-language readout.
export default function TestComparison({ tests }) {
  if (tests.length < 2) {
    return (
      <p className="text-slate-500 text-sm">
        Add one more test to see a comparison against your previous attempt.
      </p>
    );
  }

  const current = tests[tests.length - 1];
  const previous = tests[tests.length - 2];

  const curTotals = subjectTotals(current);
  const prevTotals = subjectTotals(previous);

  const curOverall = SUBJECTS.reduce((s, subj) => s + curTotals[subj].score, 0);
  const prevOverall = SUBJECTS.reduce((s, subj) => s + prevTotals[subj].score, 0);

  return (
    <div>
      <p className="text-sm text-slate-500 mb-3">
        <span className="font-medium text-slate-700">{current.name}</span> vs{" "}
        <span className="font-medium text-slate-700">{previous.name}</span>
      </p>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl font-bold">{curOverall}</span>
        <span className="text-slate-400">/ 300 overall</span>
        <Diff value={curOverall - prevOverall} />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b">
            <th className="py-1.5">Subject</th>
            <th>Score</th>
            <th>Change</th>
            <th>Unattempted</th>
          </tr>
        </thead>
        <tbody>
          {SUBJECTS.map((subject) => (
            <tr key={subject} className="border-b last:border-0">
              <td className="py-1.5 font-medium">{subject}</td>
              <td>{curTotals[subject].score}</td>
              <td>
                <Diff value={curTotals[subject].score - prevTotals[subject].score} />
              </td>
              <td>
                {curTotals[subject].unattempted}{" "}
                <Diff
                  value={
                    prevTotals[subject].unattempted - curTotals[subject].unattempted
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
