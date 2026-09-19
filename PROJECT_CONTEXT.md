# Austin ISD School & PTA Directory — Project Context

## Purpose
Civic directory/database for Austin ISD schools, PTA organizations, people, and Vertical Teams. Long-term goal: interactive React web app on Netlify.

## Technology
- React + Vite + TypeScript
- React Router
- Plain CSS currently
- GitHub source control
- Netlify deployment
- Netlify Functions later
- PostgreSQL later

## Architecture
Keep the data model normalized. Do not duplicate school, PTA, or person records in UI components.

Current data source: `src/data/austin_isd_database.json`
Data access: `src/lib/data.ts`
Keep UI independent of storage so JSON can later be replaced by API/database calls.

## Routes
- `/`
- `/schools`
- `/schools/:id`
- `/ptas`
- `/ptas/:id`
- `/vertical-teams`
- `/vertical-teams/:id`
- `/sources`
- `/about`

`/campuses` may redirect to `/schools`.

## Core data model
Entities: District, Campus, PTA organization, Person, Person role assignment, Vertical Team, Campus↔PTA, Campus↔Vertical Team, Vertical Team membership, Source, Source evidence.

### Stable person identity
`people.person_id` is the stable identity. Never use a person's name as the primary identifier. Names can change and people can have historical assignments.

Formal roles belong in `person_roles`:
- `PRINCIPAL`
- `PTA_PRESIDENT`
- `ACPTA_DELEGATE`

`is_interim` belongs to the role assignment.

## Vertical Teams
Vertical Teams are first-class entities and normally correspond to a high school plus feeder middle/elementary schools.

Tables:
- `vertical_teams`
- `campus_vertical_team`
- `vertical_team_members`

Multiple delegates are separate membership rows.

### Coordinator
Coordinator is an assignment, not a role type. Use `vertical_team_members.is_coordinator`. Do not create a `VERTICAL_TEAM_COORDINATOR` role type.

### Vertical Team Lead
Lead is a separate designation. Use `vertical_team_members.is_vertical_team_lead`. A person can be both coordinator and lead when source data says so.

## History
Preserve `school_year`, `start_date`, `end_date`, and `is_current`. Do not overwrite historical assignments.

The seeded Vertical Team data came from the supplied ACPTA 2025–26 assignment PDF and is historical/seed data until independently verified for 2026–27.

Source: https://8ea752dc-b5e7-43a1-9e11-8479657f6006.filesusr.com/ugd/c3b6e9_f7df79434d66416fb777f13800414ef8.pdf

Names in red denote Vertical Team Leads; Interim/Sub designations were preserved.

## Seed counts
- 122 campuses
- 83 PTA organizations
- 117 people
- 117 person role assignments
- 12 Vertical Teams
- 15 campus-to-Vertical-Team relationships currently seeded
- 117 Vertical Team memberships

These are seed-state counts, not claims that all data is current or production-verified.

## Known data issues
1. Revalidate the 122-campus working list against an authoritative current AISD/TEA list.
2. Becker and Paredes were marked inactive and may not belong in a current 2026–27 active-campus directory.
3. Vertical Team campus matching was incomplete during the v1.1 seed; only 15 campus-to-team relationships were created. Fix this before relying on feeder relationships.
4. PTA Presidents and ACPTA Delegates still need research/entry.
5. Some PTA URLs/statuses are approximate or based on campus/PTA-like pages and need production verification.
6. Ann Richards and several special/alternative campuses need additional PTA verification.
7. Mendez evidence demonstrates a CAC/PTA-related meeting but should not automatically be treated as proof of a current PTA.
8. T.A. Brown has a possible PTA URL typo and should be rechecked.
9. Webb remains unverified.

## PTA IDs
There does not appear to be a universal AISD/TEA PTA identifier.

Internal application PTA ID: `PTA-{TEA Campus ID}`

This is NOT an official Texas PTA/AISD identifier. If a Texas PTA local-unit ID is discovered, store it in `pta_organizations.texas_pta_id`.

## UI expectations
Home: “Austin ISD School & PTA Directory”, Browse Schools / Browse PTAs, stats for Schools / PTA Organizations / Sources.

Schools: search, school-level filter, PTA-status filter, cards, school detail links. Cards show school name, level, TEA Campus ID, PTA status, PTA name when available.

School detail: school info, principal, PTA, PTA President, Vertical Team, source/verification information.

PTAs: search, PTA/PTSA type filter, PTA cards, related school.

PTA detail: PTA name, internal ID, Texas PTA ID if known, status, contact/social links, PTA President, related school, Vertical Team, sources.

Vertical Teams: directory/detail pages with school year, high school, schools, principals, PTA Presidents, delegates, coordinator, lead, and interim designations.

## AI coding guardrails
1. Preserve the normalized relational model.
2. Do not duplicate person/school/PTA records in components.
3. Do not use names as stable identifiers.
4. Coordinator is `is_coordinator`, not a role type.
5. Keep `is_vertical_team_lead` separate from coordinator.
6. Keep `is_interim` on assignments.
7. Preserve school-year history.
8. Do not silently delete historical records.
9. Prefer reusable data-access helpers.
10. Keep routes predictable.
11. JSON is sufficient for the current dataset; do not add a backend prematurely.
12. Schema changes must update TypeScript types, JSON, SQLite artifacts, data helpers, and UI consumers consistently.
13. Retain source URLs and verification dates for factual data.
14. Do not present unverified research as authoritative.
15. Do not assume 2025–26 Vertical Team assignments are current for 2026–27.
16. Fix incomplete campus-to-Vertical-Team relationships before production.
17. Run the build after significant changes.

## Git/Cursor workflow
1. Extract project.
2. `npm install`
3. `npm run dev`
4. Initialize Git.
5. Commit.
6. Push to GitHub.
7. Connect GitHub repository to Netlify.
8. Use Cursor for normal development.
9. Keep this file as project context.

Once GitHub is connected, avoid repeatedly exchanging ZIP files.

## Netlify
`public/_redirects` contains `/* /index.html 200` to support direct React Router navigation.

## Roadmap
Near-term: fix Vertical Team campus relationships; add current 2026–27 assignments; research PTA Presidents and ACPTA Delegates; improve verification; improve filters/search; add source/evidence display.

Next: Netlify Functions/API, PostgreSQL, administrative update workflow, audit/change history, automated source verification where practical.

Longer term: public searchable directory, historical school-year views, PTA contact discovery, Vertical Team visualization, potential public data API.

## Working rule
Treat this document as the architectural baseline. Preserve the data model and source/history approach unless the user explicitly asks for a redesign.
