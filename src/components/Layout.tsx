import { Link, NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link to="/" className="brand">
            <span className="brand-mark">AISD</span>
            <span>
              <strong>School & PTA</strong>
              <small>Directory</small>
            </span>
          </Link>
          <nav>
            <NavLink to="/schools">Schools</NavLink>
            <NavLink to="/ptas">PTAs</NavLink>
          <NavLink to="/vertical-teams">Vertical Teams</NavLink>
            <NavLink to="/sources">Sources</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>Austin ISD School & PTA Directory</span>
          <span>Research-backed community directory</span>
        </div>
      </footer>
    </div>
  );
}