import { Link } from "react-router-dom";
import type { Campus } from "../types/database";
import { getCampusPTA } from "../lib/data";

export function SchoolCard({ campus }: { campus: Campus }) {
  const pta = getCampusPTA(campus.campus_id);
  return (
    <article className="card entity-card">
      <div>
        <span className="eyebrow">{campus.level || "School"}</span>
        <h3>{campus.name}</h3>
        <p className="muted">TEA Campus ID: {campus.tea_campus_id}</p>
      </div>
      <div className="card-meta">
        <span className={pta ? "status-pill active" : "status-pill"}>
          {pta ? "PTA established" : "PTA not verified"}
        </span>
        {pta && <span className="muted">{pta.name}</span>}
      </div>
      <Link className="card-link" to={`/schools/${campus.campus_id}`}>
        View school →
      </Link>
    </article>
  );
}