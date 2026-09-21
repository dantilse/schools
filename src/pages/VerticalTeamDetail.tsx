import { Link, useParams } from "react-router-dom";
import {
  getCampus,
  getPerson,
  getVerticalTeam,
  getVerticalTeamMembers,
} from "../lib/data";

export default function VerticalTeamDetail() {
  const { id } = useParams();
  const t = getVerticalTeam(Number(id));
  if (!t) {
    return (
      <section className="section">
        <div className="container">
          <h1>Vertical Team not found</h1>
          <Link to="/vertical-teams">Return to Vertical Teams</Link>
        </div>
      </section>
    );
  }

  const ms = getVerticalTeamMembers(t.vertical_team_id);

  return (
    <section className="section">
      <div className="container detail">
        <Link to="/vertical-teams" className="back-link">
          ← All vertical teams
        </Link>
        <span className="eyebrow">{t.school_year}</span>
        <h1>{t.name} Vertical Team</h1>
        <p className="muted">School leaders listed in the ACPTA assignment.</p>
        <div className="detail-section">
          <h2>Members</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>School</th>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Designation</th>
                </tr>
              </thead>
              <tbody>
                {ms.map((m) => (
                  <tr key={m.vertical_team_member_id}>
                    <td>
                      {m.campus_id ? (
                        <Link to={`/schools/${m.campus_id}`}>
                          {getCampus(m.campus_id)?.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{getPerson(m.person_id)?.display_name}</td>
                    <td>{m.role_type}</td>
                    <td>
                      {m.is_vertical_team_lead ? "VT Lead" : ""}
                      {m.is_coordinator
                        ? (m.is_vertical_team_lead ? " · " : "") + "Coordinator"
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
