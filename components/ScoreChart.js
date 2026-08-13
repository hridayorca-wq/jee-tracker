"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Shows your score on each test for this subject, plus a flat line for
// your average score in that subject across all tests.
export default function ScoreChart({ tests, subject }) {
  const scores = tests.map((test) => {
    const r = test.results.find((res) => res.subject === subject);
    return r ? r.score : 0;
  });

  const average =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const data = tests.map((test, i) => ({
    name: test.name,
    Score: scores[i],
    Average: average,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Score" stroke="#4f46e5" strokeWidth={2} />
        <Line
          type="monotone"
          dataKey="Average"
          stroke="#f59e0b"
          strokeDasharray="5 5"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
