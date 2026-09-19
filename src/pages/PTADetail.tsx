import { Link, useParams } from "react-router-dom";
import { getPTA, getPTACampus, getPTASources } from "../lib/data";

export function PTADetail() {
  const { id } = useParams();
  const pta = getPTA(Number(id));
  if (!pta) return <NotFound />;

  const campus = getPTACampus(pta.pta_id);
  const sources = getPTASources(pta);

  return (
    <section className="section">
      <div className="container detail">
        <Link to="/ptas" className="back-link">← All PTAs</Link>
        <span className="eyebrow">{pta.pta_type || "PTA"}</span>
        <h1>{pta.name || pta.internal_pta_id}</h1>
        <p className="muted">{pta.status || "Status not verified"}</p>

        <div className="detail-grid">
          <div className="detail-main">
            <section className="detail-section">
              <h2>PTA information</h2>
              <dl>
                <Info label="Internal PTA ID" value={pta.internal_pta_id} />
                <Info label="Texas PTA ID" value={pta.texas_pta_id} />
                <Info label="Status" value={pta.status} />
                <Info label="Email" value={pta.email} />
                <Info label="Phone" value={pta.phone} />
              </dl>
              <div className="button-row">
                {pta.website && <a className="button secondary" href={pta.website} target="_blank" rel="noreferrer">PTA website ↗</a>}
                {pta.facebook_url && <a className="button secondary" href={pta.facebook_url} target="_blank" rel="noreferrer">Facebook ↗</a>}
                {pta.instagram_url && <a className="button secondary" href={pta.instagram_url} target="_blank" rel="noreferrer">Instagram ↗</a>}
              </div>
            </section>

            <section className="detail-section">
              <h2>Related school</h2>
              {campus ? (
                <div className="related-card">
                  <div>
                    <span className="eyebrow">{campus.level || "School"}</span>
                    <h3>{campus.name}</h3>
                    <p className="muted">TEA Campus ID: {campus.tea_campus_id}</p>
                  </div>
                  <Link className="button secondary" to={`/schools/${campus.campus_id}`}>View school</Link>
                </div>
              ) : (
                <p className="muted">No current school relationship is verified.</p>
              )}
            </section>
          </div>

          <aside className="detail-aside">
            <h3>Verification</h3>
            <p>Last verified: {pta.last_verified || "Not recorded"}</p>
            <h3>Sources</h3>
            {sources.length ? sources.map((source) => (
              <a key={source.source_id} className="source-item" href={source.url || "#"} target="_blank" rel="noreferrer">
                {source.name || source.url || "Source"} ↗
              </a>
            )) : <p className="muted">No source records linked.</p>}
          </aside>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return <><dt>{label}</dt><dd>{value}</dd></>;
}

function NotFound() {
  return <section className="section"><div className="container"><h1>PTA not found</h1><Link to="/">Return home</Link></div></section>;
}