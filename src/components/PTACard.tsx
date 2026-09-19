import { Link } from "react-router-dom";
import type { PTAOrganization } from "../types/database";
import { getPTACampus } from "../lib/data";

export function PTACard({ pta }: { pta: PTAOrganization }) {
  const campus = getPTACampus(pta.pta_id);
  return (
    <article className="card entity-card">
      <div>
        <span className="eyebrow">{pta.pta_type || "PTA"}</span>
        <h3>{pta.name || pta.internal_pta_id}</h3>
        <p className="muted">{campus?.name || "Related school not verified"}</p>
      </div>
      <div className="card-meta">
        <span className="status-pill active">{pta.status || "Status not verified"}</span>
      </div>
      <Link className="card-link" to={`/ptas/${pta.pta_id}`}>
        View PTA →
      </Link>
    </article>
  );
}