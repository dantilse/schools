# Austin ISD School & PTA Directory — v1.1

React + Vite + TypeScript directory for Austin ISD schools, PTAs, people, and Vertical Teams.

Data model:
- Stable `person_id`
- `person_roles`: PRINCIPAL, PTA_PRESIDENT, ACPTA_DELEGATE
- `is_interim` on role assignments
- `vertical_teams`
- `campus_vertical_team`
- `vertical_team_members`
- Independent `is_coordinator` and `is_vertical_team_lead` flags
- Multiple delegates supported by multiple membership records
- Seeded Vertical Team composition from the supplied ACPTA 2025–26 PDF

Run:
npm install
npm run dev

Build:
npm run build
