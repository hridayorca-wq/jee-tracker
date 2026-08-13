"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculateScore, unattempted, MCQ_TOTAL, NUM_TOTAL } from "@/lib/scoring";

const SUBJECTS = ["Physics", "Chemistry", "Maths"];

const emptySubject = { mcqCorrect: "", mcqWrong: "", numCorrect: "", numWrong: "" };

export default function AddTestPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [subjects, setSubjects] = useState({
    Physics: { ...emptySubject },
    Chemistry: { ...emptySubject },
    Maths: { ...emptySubject },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(subject, field, value) {
    setSubjects((prev) => ({
      ...prev,
      [subject]: { ...prev[subject], [field]: value },
    }));
  }

  function preview(subject) {
    const s = subjects[subject];
    const nums = {
      mcqCorrect: Number(s.mcqCorrect) || 0,
      mcqWrong: Number(s.mcqWrong) || 0,
      numCorrect: Number(s.numCorrect) || 0,
      numWrong: Number(s.numWrong) || 0,
    };
    const { mcqUnattempted, numUnattempted } = unattempted(nums);
    const score = calculateScore(nums);
    return { ...nums, mcqUnattempted, numUnattempted, score };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic sanity check: nobody can answer more than 20 MCQs or 5 numericals
    for (const subject of SUBJECTS) {
      const p = preview(subject);
      if (p.mcqCorrect + p.mcqWrong > MCQ_TOTAL) {
        setError(`${subject}: MCQ correct + wrong can't exceed ${MCQ_TOTAL}`);
        return;
      }
      if (p.numCorrect + p.numWrong > NUM_TOTAL) {
        setError(`${subject}: Numerical correct + wrong can't exceed ${NUM_TOTAL}`);
        return;
      }
    }

    setSaving(true);
    const res = await fetch("/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, subjects }),
    });
    setSaving(false);

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add a Test</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Test name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="JEE Main Mock 5"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {SUBJECTS.map((subject) => {
          const p = preview(subject);
          return (
            <div key={subject} className="bg-white border rounded-xl p-5">
              <h2 className="font-semibold mb-4">{subject}</h2>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    Section A · MCQ (out of {MCQ_TOTAL})
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-slate-500">Correct</label>
                      <input
                        type="number"
                        min="0"
                        max={MCQ_TOTAL}
                        value={subjects[subject].mcqCorrect}
                        onChange={(e) => updateField(subject, "mcqCorrect", e.target.value)}
                        className="w-full border rounded-lg px-2 py-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-500">Wrong</label>
                      <input
                        type="number"
                        min="0"
                        max={MCQ_TOTAL}
                        value={subjects[subject].mcqWrong}
                        onChange={(e) => updateField(subject, "mcqWrong", e.target.value)}
                        className="w-full border rounded-lg px-2 py-1.5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    Section B · Numerical (out of {NUM_TOTAL})
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-slate-500">Correct</label>
                      <input
                        type="number"
                        min="0"
                        max={NUM_TOTAL}
                        value={subjects[subject].numCorrect}
                        onChange={(e) => updateField(subject, "numCorrect", e.target.value)}
                        className="w-full border rounded-lg px-2 py-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-500">Wrong</label>
                      <input
                        type="number"
                        min="0"
                        max={NUM_TOTAL}
                        value={subjects[subject].numWrong}
                        onChange={(e) => updateField(subject, "numWrong", e.target.value)}
                        className="w-full border rounded-lg px-2 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                <span className="text-slate-500">
                  Unattempted: {p.mcqUnattempted + p.numUnattempted} / {MCQ_TOTAL + NUM_TOTAL}
                </span>
                <span className="font-semibold text-indigo-700">
                  Score: {p.score} / 100
                </span>
              </div>
            </div>
          );
        })}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Test"}
        </button>
      </form>
    </div>
  );
}
