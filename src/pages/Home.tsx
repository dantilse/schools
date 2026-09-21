import { Link } from "react-router-dom";
import { database } from "../lib/data";
import { StatCard } from "../components/StatCard";

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Austin ISD community directory</span>
            <h1>
              Find a school.
              <br />
              Find its PTA.
            </h1>
            <p>
              Explore Austin ISD schools and the parent organizations connected
              to them, with source and verification information built into the
              directory.
            </p>
            <div className="button-row">
              <Link className="button primary" to="/schools">
                Browse Schools
              </Link>
              <Link className="button secondary" to="/ptas">
                Browse PTAs
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-panel-label">Directory snapshot</div>
            <div className="stats">
              <StatCard value={database.campuses.length} label="Schools" />
              <StatCard
                value={database.pta_organizations.length}
                label="PTA organizations"
              />
              <StatCard value={database.sources.length} label="Sources" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Explore</span>
              <h2>Two ways in</h2>
            </div>
          </div>
          <div className="feature-grid">
            <Link to="/schools" className="feature-card">
              <span className="feature-number">01</span>
              <h3>Schools</h3>
              <p>
                Browse the Austin ISD campus directory, filter schools, and open
                detailed school records.
              </p>
              <span>Explore schools →</span>
            </Link>
            <Link to="/ptas" className="feature-card">
              <span className="feature-number">02</span>
              <h3>PTAs</h3>
              <p>
                Find PTA/PTSA organizations and jump directly to their related
                school.
              </p>
              <span>Explore PTAs →</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
