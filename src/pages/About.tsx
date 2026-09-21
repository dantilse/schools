export function About() {
  return (
    <section className="section">
      <div className="container narrow">
        <span className="eyebrow">About the directory</span>
        <h1>Austin ISD School & PTA Directory</h1>
        <p>
          This project is designed as a structured, searchable directory
          connecting Austin ISD schools with their PTA/PTSA organizations.
        </p>
        <p>
          The initial application uses a normalized JSON export of the project
          database. The architecture is intentionally separated from the data
          source so it can later move to an API and PostgreSQL without
          rebuilding the user interface.
        </p>
        <div className="notice">
          <strong>Research status</strong>
          <p>
            PTA availability and contact information should be treated as
            research data rather than an official Austin ISD or Texas PTA
            registry. Source and verification fields are included so records can
            be reviewed and updated.
          </p>
        </div>
      </div>
    </section>
  );
}
