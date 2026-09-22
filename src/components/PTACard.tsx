import { Link } from "react-router-dom";
import type { Campus } from "../types/database";
import { getCampusPTA, getCampusPTAPath, unverifiedPTAName } from "../lib/data";

export function PTACard({ campus }: { campus: Campus }) {
  const pta = getCampusPTA(campus.campus_id);
  const name = pta?.name || unverifiedPTAName(campus);
  const established = Boolean(pta);

  return (
    <article className="card entity-card">
      <div>
        <span className="eyebrow">{pta?.pta_type || "PTA"}</span>
        <h3>{name}</h3>
        <p className="muted">{campus.name}</p>
      </div>
      <div className="card-meta">
        <span className={established ? "status-pill active" : "status-pill"}>
          {established ? "PTA established" : "PTA not verified"}
        </span>
      </div>
      <Link className="card-link" to={getCampusPTAPath(campus.campus_id)}>
        View PTA →
      </Link>
    </article>
  );
}
