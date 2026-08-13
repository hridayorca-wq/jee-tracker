"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = { Correct: "#22c55e", Incorrect: "#ef4444", Unattempted: "#94a3b8" };

// Shows a pie of correct / incorrect / unattempted (MCQ + Numerical combined)
// for one chosen test. A dropdown lets you switch which test you're viewing,
// defaulting to the most recent one.
export default function AccuracyChart({ tests, subject }) {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (tests.length > 0) {
      setSelectedId(tests[tests.length - 1].id);
    }
  }, [tests]);

  const selectedTest = tests.find((t) => t.id === selectedId) || tests[tests.length - 1];
  const r = selectedTest?.results.find((res) => res.subject === subject);

  const data = r
    ? [
        { name: "Correct", value: r.mcqCorrect + r.numCorrect },
        { name: "Incorrect", value: r.mcqWrong + r.numWrong },
        { name: "Unattempted", value: r.mcqUnattempted + r.numUnattempted },
      ]
    : [];

  return (
    <div>
      <select
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(Number(e.target.value))}
        className="mb-2 text-sm border rounded-lg px-2 py-1"
      >
        {tests.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
