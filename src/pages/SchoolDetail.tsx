import { Link, useParams } from "react-router-dom";
import { getCampus, getCampusPTA, getCampusSources } from "../lib/data";

export function SchoolDetail() {
  const { id } = useParams();
  const campus = getCampus(Number(id));
  if (!campus) return <NotFound label="School" />;

  const pta = getCampusPTA(campus.campus_id);
  const sources = getCampusSources(campus);

  return (
    <section className="section">
      <div className="container detail">
        <Link to="/schools" className="back-link">
          ← All schools
        </Link>
        <span className="eyebrow">{campus.level || "School"}</span>
        <h1>{campus.name}</h1>
        <p className="muted">TEA Campus ID: {campus.tea_campus_id}</p>

        <div className="detail-grid">
          <div className="detail-main">
            <section className="detail-section">
              <h2>School information</h2>
              <dl>
                <Info label="Status" value={campus.status} />
                <Info label="Campus type" value={campus.campus_type} />
                <Info
                  label="Address"
                  value={[campus.address, campus.city, campus.state, campus.zip]
                    .filter(Boolean)
                    .join(", ")}
                />
                <Info label="Phone" value={campus.phone} />
              </dl>
              {campus.official_url && (
                <a
                  className="external-link"
                  href={campus.official_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit school website ↗
                </a>
              )}
            </section>

            <section className="detail-section">
              <h2>Parent organization</h2>
              {pta ? (
                <div className="related-card">
                  <div>
                    <span className="eyebrow">{pta.pta_type || "PTA"}</span>
                    <h3>{pta.name}</h3>
                    <p className="muted">
                      {pta.status || "Status not verified"}
                    </p>
                  </div>
                  <Link className="button secondary" to={`/ptas/${pta.pta_id}`}>
                    View PTA
                  </Link>
                </div>
              ) : (
                <p className="muted">
                  No current PTA relationship is verified in the dataset.
                </p>
              )}
            </section>
          </div>

          <aside className="detail-aside">
            <h3>Verification</h3>
            <p>Last verified: {campus.last_verified || "Not recorded"}</p>
            <h3>Sources</h3>
            {sources.length ? (
              sources.map((source) => (
                <a
                  key={source.source_id}
                  className="source-item"
                  href={source.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.name || source.url || "Source"} ↗
                </a>
              ))
            ) : (
              <p className="muted">No source records linked.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

function NotFound({ label }: { label: string }) {
  return (
    <section className="section">
      <div className="container">
        <h1>{label} not found</h1>
        <Link to="/">Return home</Link>
      </div>
    </section>
  );
}
