import { Link, Navigate, useParams } from "react-router-dom";
import {
  getCampus,
  getCampusPTA,
  getPTA,
  getPTACampus,
  getPTASources,
  unverifiedPTAName,
} from "../lib/data";
import type { Campus, PTAOrganization, Source } from "../types/database";

export function PTADetail() {
  const { id, campusId } = useParams();

  if (campusId) {
    const campus = getCampus(Number(campusId));
    if (!campus) return <NotFound />;
    const existing = getCampusPTA(campus.campus_id);
    if (existing) return <Navigate to={`/ptas/${existing.pta_id}`} replace />;
    return (
      <PTADetailView
        name={unverifiedPTAName(campus)}
        type="PTA"
        status="PTA not verified"
        internalId="N/A"
        campus={campus}
        sources={[]}
        lastVerified={null}
      />
    );
  }

  const pta = getPTA(Number(id));
  if (!pta) return <NotFound />;
  return <EstablishedPTADetail pta={pta} />;
}

function EstablishedPTADetail({ pta }: { pta: PTAOrganization }) {
  const campus = getPTACampus(pta.pta_id);
  const sources = getPTASources(pta);

  return (
    <PTADetailView
      name={pta.name || pta.internal_pta_id}
      type={pta.pta_type || "PTA"}
      status={pta.status || "Status not verified"}
      internalId={pta.internal_pta_id}
      texasPtaId={pta.texas_pta_id}
      email={pta.email}
      phone={pta.phone}
      website={pta.website}
      facebookUrl={pta.facebook_url}
      instagramUrl={pta.instagram_url}
      campus={campus}
      sources={sources}
      lastVerified={pta.last_verified}
    />
  );
}

function PTADetailView({
  name,
  type,
  status,
  internalId,
  texasPtaId,
  email,
  phone,
  website,
  facebookUrl,
  instagramUrl,
  campus,
  sources,
  lastVerified,
}: {
  name: string;
  type: string;
  status: string;
  internalId: string;
  texasPtaId?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  campus?: Campus;
  sources: Source[];
  lastVerified?: string | null;
}) {
  return (
    <section className="section">
      <div className="container detail">
        <Link to="/ptas" className="back-link">
          ← All PTAs
        </Link>
        <span className="eyebrow">{type}</span>
        <h1>{name}</h1>
        <p className="muted">{status}</p>

        <div className="detail-grid">
          <div className="detail-main">
            <section className="detail-section">
              <h2>PTA information</h2>
              <dl>
                <Info label="Internal PTA ID" value={internalId} />
                <Info label="Texas PTA ID" value={texasPtaId} />
                <Info label="Status" value={status} />
                <Info label="Email" value={email} />
                <Info label="Phone" value={phone} />
              </dl>
              <div className="button-row">
                {website && (
                  <a
                    className="button secondary"
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    PTA website ↗
                  </a>
                )}
                {facebookUrl && (
                  <a
                    className="button secondary"
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook ↗
                  </a>
                )}
                {instagramUrl && (
                  <a
                    className="button secondary"
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram ↗
                  </a>
                )}
              </div>
            </section>

            <section className="detail-section">
              <h2>Related school</h2>
              {campus ? (
                <div className="related-card">
                  <div>
                    <span className="eyebrow">{campus.level || "School"}</span>
                    <h3>{campus.name}</h3>
                    <p className="muted">
                      TEA Campus ID: {campus.tea_campus_id}
                    </p>
                  </div>
                  <Link
                    className="button secondary"
                    to={`/schools/${campus.campus_id}`}
                  >
                    View school
                  </Link>
                </div>
              ) : (
                <p className="muted">
                  No current school relationship is verified.
                </p>
              )}
            </section>
          </div>

          <aside className="detail-aside">
            <h3>Verification</h3>
            <p>Last verified: {lastVerified || "Not recorded"}</p>
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

function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <h1>PTA not found</h1>
        <Link to="/">Return home</Link>
      </div>
    </section>
  );
}
