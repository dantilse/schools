import { Link, useParams } from "react-router-dom";
import {
  getCampus,
  getPerson,
  getVerticalTeam,
  getVerticalTeamCampuses,
  getVerticalTeamMembers,
  getVerticalTeamTree,
} from "../lib/data";
import type { Campus, VerticalTeamMember } from "../types/database";

function memberLabel(m: VerticalTeamMember) {
  const parts = [m.role_type.replace(/_/g, " ")];
  if (m.is_vertical_team_lead) parts.push("VT Lead");
  if (m.is_coordinator) parts.push("Coordinator");
  return parts.join(" · ");
}

function CampusPeople({
  campus,
  members,
}: {
  campus: Campus;
  members: VerticalTeamMember[];
}) {
  const people = members.filter((m) => m.campus_id === campus.campus_id);
  return (
    <div className="vt-campus">
      <div className="vt-campus-head">
        <Link to={`/schools/${campus.campus_id}`}>{campus.name}</Link>
        <span className="muted">{campus.level}</span>
      </div>
      {people.length ? (
        <ul className="vt-people">
          {people.map((m) => (
            <li key={m.vertical_team_member_id}>
              {getPerson(m.person_id)?.display_name}
              <span className="muted"> {memberLabel(m)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No team members listed for this campus.</p>
      )}
    </div>
  );
}

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

  const members = getVerticalTeamMembers(t.vertical_team_id);
  const tree = getVerticalTeamTree(t.vertical_team_id);
  const roster = getVerticalTeamCampuses(t.vertical_team_id);
  const rosterIds = new Set(roster.map((c) => c.campus_id));
  const lead = members.filter((m) => m.is_vertical_team_lead);
  const coordinators = members.filter((m) => m.is_coordinator);
  const unplaced = members.filter(
    (m) => !m.campus_id || !rosterIds.has(m.campus_id),
  );

  return (
    <section className="section">
      <div className="container detail">
        <Link to="/vertical-teams" className="back-link">
          ← All vertical teams
        </Link>
        <span className="eyebrow">{t.school_year}</span>
        <h1>{t.name} Vertical Team</h1>
        <p className="muted">
          {tree.highSchool || tree.groups.length
            ? `Campuses on this team for ${t.school_year}. Elementary schools appear under their parent campus or campuses when a Vertical Team group exists.`
            : `Campuses on this team for ${t.school_year}. This team is a campus collection, not a high-school feeder grouping.`}
        </p>

        {Boolean(lead.length || coordinators.length) && (
          <div className="detail-section">
            <h2>Team designations</h2>
            {lead.map((m) => (
              <p key={m.vertical_team_member_id}>
                <strong>VT Lead:</strong> {getPerson(m.person_id)?.display_name}
              </p>
            ))}
            {coordinators.map((m) => (
              <p key={m.vertical_team_member_id}>
                <strong>Coordinator:</strong>{" "}
                {getPerson(m.person_id)?.display_name}
              </p>
            ))}
          </div>
        )}

        {tree.highSchool && (
          <div className="detail-section">
            <h2>High school</h2>
            <CampusPeople campus={tree.highSchool} members={members} />
          </div>
        )}

        {tree.groups.map((group, index) => (
          <div
            className="detail-section"
            key={group.vertical_team_group_id ?? `ungrouped-${group.parents[0]?.campus_id ?? index}`}
          >
            <h2>{group.parents.map((p) => p.name).join(" and ")}</h2>
            {group.parents.map((parent) => (
              <CampusPeople
                key={parent.campus_id}
                campus={parent}
                members={members}
              />
            ))}
            {group.campuses.length ? (
              <div className="vt-elementary">
                <h3>Grouped campuses</h3>
                {group.campuses.map((campus) => (
                  <CampusPeople
                    key={campus.campus_id}
                    campus={campus}
                    members={members}
                  />
                ))}
              </div>
            ) : (
              <p className="muted">
                No campuses are grouped under{" "}
                {group.parents.length > 1 ? "these schools" : "this school"} yet.
              </p>
            )}
          </div>
        ))}

        {tree.otherCampuses.length > 0 && (
          <div className="detail-section">
            <h2>
              {tree.highSchool || tree.groups.length
                ? "Other campuses"
                : "Campuses"}
            </h2>
            {tree.otherCampuses.map((campus) => (
              <CampusPeople
                key={campus.campus_id}
                campus={campus}
                members={members}
              />
            ))}
          </div>
        )}

        {unplaced.length > 0 && (
          <div className="detail-section">
            <h2>Listed members</h2>
            <p className="muted">
              These ACPTA-listed people are not attached to a campus on this
              team roster.
            </p>
            <ul className="vt-people">
              {unplaced.map((m) => (
                <li key={m.vertical_team_member_id}>
                  {getPerson(m.person_id)?.display_name}
                  <span className="muted"> {memberLabel(m)}</span>
                  {m.campus_id ? (
                    <span className="muted">
                      {" "}
                      · {getCampus(m.campus_id)?.name}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
