import { useMemo, useState } from "react";
import { database, getCampusPTA } from "../lib/data";
import { PTACard } from "../components/PTACard";

export function PTAs() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

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
    return database.campuses.filter((campus) => {
      const pta = getCampusPTA(campus.campus_id);
      const established = Boolean(pta);
      const displayName = pta?.name || `${campus.name} PTA`;
      const haystack =
        `${displayName} ${pta?.internal_pta_id || ""} ${campus.name} ${campus.tea_campus_id}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesType =
        type === "All" ||
        (established ? pta?.pta_type === type : type === "PTA");
      const matchesStatus =
        status === "All" ||
        (status === "Established" && established) ||
        (status === "Not established" && !established);
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [query, type, status]);

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Directory</span>
        <h1>PTAs</h1>
        <p className="page-intro">
          Browse PTA and PTSA organizations for every school in the directory.
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
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            <option>Established</option>
            <option>Not established</option>
          </select>
        </div>

        <div className="result-count">{results.length} PTA listings</div>
        <div className="card-grid">
          {results.map((campus) => (
            <PTACard key={campus.campus_id} campus={campus} />
          ))}
        </div>
      </div>
    </section>
  );
}
