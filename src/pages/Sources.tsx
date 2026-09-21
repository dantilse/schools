import { database } from "../lib/data";

export function Sources() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Methodology</span>
        <h1>Sources</h1>
        <p className="page-intro">
          Source records document where school and PTA information came from and
          when it was verified.
        </p>
        <div className="source-table">
          {database.sources.map((source) => (
            <div className="source-row" key={source.source_id}>
              <div>
                <strong>{source.name || "Unnamed source"}</strong>
                <span>
                  {source.publisher || source.source_type || "Source"}
                </span>
              </div>
              {source.url && (
                <a href={source.url} target="_blank" rel="noreferrer">
                  Open source ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
