import { useMemo, useState } from "react";
import { database } from "../lib/data";
import { SchoolCard } from "../components/SchoolCard";

export function Schools() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [pta, setPta] = useState("All");

  const levels = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(database.campuses.map((c) => c.level).filter(Boolean)),
      ),
    ],
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return database.campuses.filter((campus) => {
      const matchesQuery =
        !q ||
        campus.name.toLowerCase().includes(q) ||
        campus.tea_campus_id.includes(q);
      const matchesLevel = level === "All" || campus.level === level;
      const hasPta = database.campus_pta.some(
        (r) => r.campus_id === campus.campus_id && r.is_current === 1,
      );
      const matchesPta =
        pta === "All" ||
        (pta === "Established" && hasPta) ||
        (pta === "Not verified" && !hasPta);
      return matchesQuery && matchesLevel && matchesPta;
    });
  }, [query, level, pta]);

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Directory</span>
        <h1>Schools</h1>
        <p className="page-intro">
          Browse all schools currently represented in the directory.
        </p>

        <div className="filters">
          <input
            className="search"
            placeholder="Search schools or TEA Campus ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            {levels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={pta} onChange={(e) => setPta(e.target.value)}>
            <option>All</option>
            <option>Established</option>
            <option>Not verified</option>
          </select>
        </div>

        <div className="result-count">{results.length} schools</div>
        <div className="card-grid">
          {results.map((campus) => (
            <SchoolCard key={campus.campus_id} campus={campus} />
          ))}
        </div>
      </div>
    </section>
  );
}
