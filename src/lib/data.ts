import raw from "../data/austin_isd_database.json";
import type {
  Campus,
  CampusAccountability,
  CampusPTA,
  CampusVerticalTeam,
  Database,
  PTAOrganization,
  Source,
  SourceEvidence,
  VerticalTeam,
  VerticalTeamGroup,
  VerticalTeamGroupParent,
  VerticalTeamMember,
} from "../types/database";
const db = raw as unknown as Database;
export const getCampuses = () => db.campuses;
export const getPTAs = () => db.pta_organizations;
export const getVerticalTeams = () => db.vertical_teams;
export const getPeople = () => db.people;
export const getCampus = (id: number) =>
  db.campuses.find((c) => c.campus_id === id);
export const getPTA = (id: number) =>
  db.pta_organizations.find((p) => p.pta_id === id);
export const getPerson = (id: number) =>
  db.people.find((p) => p.person_id === id);
export const getCampusPTARelationship = (
  id: number,
  schoolYear?: string,
): CampusPTA | undefined =>
  db.campus_pta.find(
    (x) =>
      x.campus_id === id &&
      (schoolYear ? x.school_year === schoolYear : x.is_current),
  );
export const getPTACampusRelationship = (
  id: number,
  schoolYear?: string,
): CampusPTA | undefined =>
  db.campus_pta.find(
    (x) =>
      x.pta_id === id &&
      (schoolYear ? x.school_year === schoolYear : x.is_current),
  );
export const getCampusPTA = (id: number, schoolYear?: string) => {
  const r = getCampusPTARelationship(id, schoolYear);
  return r ? getPTA(r.pta_id) : undefined;
};
export const getPTACampus = (id: number, schoolYear?: string) => {
  const r = getPTACampusRelationship(id, schoolYear);
  return r ? getCampus(r.campus_id) : undefined;
};
export const unverifiedPTAName = (campus: Campus) => `${campus.name} PTA`;
export const getCampusPTAPath = (campusId: number) => {
  const pta = getCampusPTA(campusId);
  return pta ? `/ptas/${pta.pta_id}` : `/ptas/campus/${campusId}`;
};
export const getCampusPTAHistory = (id: number): CampusPTA[] =>
  db.campus_pta.filter((x) => x.campus_id === id);
export const getPTACampusHistory = (id: number): CampusPTA[] =>
  db.campus_pta.filter((x) => x.pta_id === id);
export const getCampusAccountability = (
  id: number,
  schoolYear: string,
): CampusAccountability | undefined =>
  db.campus_accountability.find(
    (x) => x.campus_id === id && x.school_year === schoolYear && x.is_current,
  );
export const getCampusAccountabilityHistory = (
  id: number,
): CampusAccountability[] =>
  db.campus_accountability
    .filter((x) => x.campus_id === id)
    .sort(
      (a, b) =>
        a.school_year.localeCompare(b.school_year) ||
        a.published_at?.localeCompare(b.published_at || "") ||
        0,
    );
export const getCampusUARatingTrend = (id: number): CampusAccountability[] =>
  db.campus_accountability
    .filter(
      (x) =>
        x.campus_id === id && x.publication_status === "FINAL" && x.is_current,
    )
    .sort((a, b) => a.school_year.localeCompare(b.school_year));
export const getCampusRoles = (id: number) =>
  db.person_roles.filter((r) => r.campus_id === id && r.is_current);
export const getPTARoles = (id: number) =>
  db.person_roles.filter((r) => r.pta_id === id && r.is_current);
export const getVerticalTeam = (id: number) =>
  db.vertical_teams.find((v) => v.vertical_team_id === id);
const matchesTeamYear = (row: { school_year?: string; is_current: number }, team?: VerticalTeam, year?: string) => {
  if (year) return row.school_year === year;
  if (team?.school_year) return row.school_year === team.school_year || Boolean(row.is_current);
  return Boolean(row.is_current);
};
export const getVerticalTeamMembers = (id: number, year?: string): VerticalTeamMember[] => {
  const team = getVerticalTeam(id);
  return db.vertical_team_members.filter(
    (m) => m.vertical_team_id === id && matchesTeamYear(m, team, year),
  );
};
export const getCampusVerticalTeam = (id: number, year?: string): CampusVerticalTeam[] => {
  const rows = db.campus_vertical_team.filter((r) => r.campus_id === id);
  if (year) return rows.filter((r) => r.school_year === year);
  const current = rows.filter((r) => r.is_current);
  return current.length ? current : rows;
};
export const getVerticalTeamCampuses = (id: number, year?: string): Campus[] => {
  const team = getVerticalTeam(id);
  return db.campus_vertical_team
    .filter((r) => r.vertical_team_id === id && matchesTeamYear(r, team, year))
    .map((r) => getCampus(r.campus_id))
    .filter(Boolean) as Campus[];
};
export const getVerticalTeamGroups = (id: number, year?: string): VerticalTeamGroup[] => {
  const team = getVerticalTeam(id);
  return db.vertical_team_groups.filter(
    (g) => g.vertical_team_id === id && matchesTeamYear(g, team, year),
  );
};

export const getVerticalTeamGroupParents = (
  groupId: number,
): VerticalTeamGroupParent[] =>
  db.vertical_team_group_parents.filter((p) => p.vertical_team_group_id === groupId);

export type VerticalTeamCampusGroup = {
  vertical_team_group_id?: number;
  parents: Campus[];
  campuses: Campus[];
};
export type VerticalTeamTree = {
  highSchool?: Campus;
  groups: VerticalTeamCampusGroup[];
  otherCampuses: Campus[];
};

export const getVerticalTeamTree = (id: number, year?: string): VerticalTeamTree => {
  const team = getVerticalTeam(id);
  const schoolYear = year ?? team?.school_year;
  const roster = getVerticalTeamCampuses(id, schoolYear);
  const rosterIds = new Set(roster.map((c) => c.campus_id));
  const byName = (a: Campus, b: Campus) => a.name.localeCompare(b.name);
  const highSchool = team?.high_school_campus_id
    ? roster.find((c) => c.campus_id === team.high_school_campus_id)
    : undefined;
  const nested = new Set<number>();
  if (highSchool) nested.add(highSchool.campus_id);
  const groups: VerticalTeamCampusGroup[] = [];
  for (const group of getVerticalTeamGroups(id, schoolYear)) {
    const parents = getVerticalTeamGroupParents(group.vertical_team_group_id)
      .map((p) => getCampus(p.campus_id))
      .filter((c): c is Campus => c != null && rosterIds.has(c.campus_id))
      .sort(byName);
    if (!parents.length) continue;
    parents.forEach((c) => nested.add(c.campus_id));
    const campuses = db.vertical_team_group_members
      .filter((m) => m.vertical_team_group_id === group.vertical_team_group_id)
      .map((m) => getCampus(m.campus_id))
      .filter((c): c is Campus => c != null && rosterIds.has(c.campus_id))
      .sort(byName);
    campuses.forEach((c) => nested.add(c.campus_id));
    groups.push({
      vertical_team_group_id: group.vertical_team_group_id,
      parents,
      campuses,
    });
  }
  groups.sort((a, b) => byName(a.parents[0]!, b.parents[0]!));
  const groupedParents = new Set(groups.flatMap((g) => g.parents.map((p) => p.campus_id)));
  for (const middle of roster.filter((c) => c.level === "Middle" && !groupedParents.has(c.campus_id)).sort(byName)) {
    nested.add(middle.campus_id);
    groups.push({ parents: [middle], campuses: [] });
  }
  const otherCampuses = roster.filter((c) => !nested.has(c.campus_id)).sort(byName);
  return { highSchool, groups, otherCampuses };
};
export const getCampusSources = (campus: Campus): Source[] =>
  db.source_evidence
    .filter(
      (e) =>
        e.entity_type === "campus" && e.entity_id === String(campus.campus_id),
    )
    .map((e) => db.sources.find((s) => s.source_id === e.source_id))
    .filter(Boolean) as Source[];
export const getPTASources = (pta: PTAOrganization): Source[] =>
  db.source_evidence
    .filter(
      (e) => e.entity_type === "pta" && e.entity_id === String(pta.pta_id),
    )
    .map((e) => db.sources.find((s) => s.source_id === e.source_id))
    .filter(Boolean) as Source[];
export const getSourceEvidence = (id: number): SourceEvidence[] =>
  db.source_evidence.filter((e) => e.source_id === id);
export { db };
export const database = db;
