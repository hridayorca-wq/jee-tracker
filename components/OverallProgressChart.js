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

const SUBJECTS = ["Physics", "Chemistry", "Maths"];

// Shows your total score (out of 300) across every test you've logged.
export default function OverallProgressChart({ tests }) {
  const data = tests.map((test) => {
    const total = SUBJECTS.reduce((sum, subject) => {
      const r = test.results.find((res) => res.subject === subject);
      return sum + (r ? r.score : 0);
    }, 0);
    return { name: test.name, Total: total };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 300]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Total" stroke="#4f46e5" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
