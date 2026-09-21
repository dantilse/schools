import { useMemo, useState } from "react";
import { database } from "../lib/data";
import { PTACard } from "../components/PTACard";

export function PTAs() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  const types = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          database.pta_organizations.map((p) => p.pta_type).filter(Boolean),
        ),
      ),
    ],
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return database.pta_organizations.filter((pta) => {
      const campusName = database.campus_pta.find(
        (r) => r.pta_id === pta.pta_id && r.is_current === 1,
      );
      const campus = campusName
        ? database.campuses.find((c) => c.campus_id === campusName.campus_id)
        : undefined;
      const haystack =
        `${pta.name || ""} ${pta.internal_pta_id} ${campus?.name || ""}`.toLowerCase();
      return (
        (!q || haystack.includes(q)) &&
        (type === "All" || pta.pta_type === type)
      );
    });
  }, [query, type]);

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Directory</span>
        <h1>PTAs</h1>
        <p className="page-intro">
          Browse PTA and PTSA organizations represented in the directory.
        </p>

        <div className="filters">
          <input
            className="search"
            placeholder="Search PTAs or schools…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {types.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="result-count">{results.length} PTA organizations</div>
        <div className="card-grid">
          {results.map((pta) => (
            <PTACard key={pta.pta_id} pta={pta} />
          ))}
        </div>
      </div>
    </section>
  );
}
