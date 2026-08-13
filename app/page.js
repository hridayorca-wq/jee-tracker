"use client";

import { useEffect, useState } from "react";
import AccuracyChart from "@/components/AccuracyChart";
import ScoreChart from "@/components/ScoreChart";
import OverallProgressChart from "@/components/OverallProgressChart";
import TestComparison from "@/components/TestComparison";

const SUBJECTS = ["Physics", "Chemistry", "Maths"];

export default function DashboardPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTests() {
    setLoading(true);
    const res = await fetch("/api/tests");
    const data = await res.json();
    setTests(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTests();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this test?")) return;
    await fetch(`/api/tests/${id}`, { method: "DELETE" });
    loadTests();
  }

  if (loading) {
    return <p className="text-slate-500">Loading your data...</p>;
  }

  if (tests.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">No tests yet</h2>
        <p className="text-slate-500 mb-4">
          Add your first mock test to see your graphs here.
        </p>
        <a
          href="/add"
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
        >
          Add a Test
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-slate-500">
          {tests.length} test{tests.length > 1 ? "s" : ""} logged
        </p>
      </div>

      <section className="bg-white rounded-xl border p-5">
        <h2 className="text-lg font-semibold mb-4">Overall Progress</h2>
        <OverallProgressChart tests={tests} />
      </section>

      <section className="bg-white rounded-xl border p-5">
        <h2 className="text-lg font-semibold mb-4">Latest vs Previous Test</h2>
        <TestComparison tests={tests} />
      </section>

      {SUBJECTS.map((subject) => (
        <section key={subject} className="bg-white rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4">{subject}</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">
                Correct / Incorrect / Unattempted
              </h3>
              <AccuracyChart tests={tests} subject={subject} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">
                Score vs Average
              </h3>
              <ScoreChart tests={tests} subject={subject} />
            </div>
          </div>
        </section>
      ))}

      <section className="bg-white rounded-xl border p-5">
        <h2 className="text-lg font-semibold mb-4">All Tests</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Test</th>
              <th>Exam</th>
              <th>Date</th>
              <th>Physics</th>
              <th>Chemistry</th>
              <th>Maths</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => {
              const scoreFor = (subject) =>
                test.results.find((r) => r.subject === subject)?.score ?? 0;
              const total = SUBJECTS.reduce((sum, s) => sum + scoreFor(s), 0);
              return (
                <tr key={test.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">
                    {test.name}
                    {test.notes && (
                      <p className="text-xs text-slate-400 font-normal mt-0.5">
                        {test.notes}
                      </p>
                    )}
                  </td>
                  <td className="text-slate-500">{test.examType}</td>
                  <td>{new Date(test.date).toLocaleDateString()}</td>
                  <td>{scoreFor("Physics")}</td>
                  <td>{scoreFor("Chemistry")}</td>
                  <td>{scoreFor("Maths")}</td>
                  <td className="font-semibold">{total}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
