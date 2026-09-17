import { Link, useLocation } from "react-router-dom";
import "./admin.css";

function AdminLayout({ children }) {
  const location = useLocation();

  const navItems = [
    {
      to: "/admin/dashboard",
      title: "Command Center",
      desc: "Mandi operations overview",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      to: "/admin/scan",
      title: "Token Scanner",
      desc: "Gate verification",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
          <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
          <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
          <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
          <line x1="7" y1="12" x2="17" y2="12"></line>
        </svg>
      ),
    },
    {
      to: "/admin/quality",
      title: "Quality Assessment",
      desc: "Weight, grade & pricing",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <path d="m9 14 2 2 4-4"></path>
        </svg>
      ),
    },
    {
      to: "/admin/inventory",
      title: "Inventory",
      desc: "Storage & dispatch ledger",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          <path d="m3.3 7 8.7 5 8.7-5"></path>
          <path d="M12 22V12"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div>
          {/* Brand Header */}
          <div className="sidebar-brand">
            <div className="brand-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            </div>
            <div className="brand-titles">
              <h2 className="brand-name">AgriFlow</h2>
              <span className="brand-sub">Mandi Admin Portal</span>
            </div>
          </div>

          {/* Category */}
          <div className="sidebar-category">Procurement Operations</div>

          {/* Links */}
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-link-item ${isActive ? "active" : ""}`}
                >
                  <div className="nav-item-icon">{item.icon}</div>
                  <div className="nav-item-content">
                    <span className="nav-item-title">{item.title}</span>
                    <span className="nav-item-desc">{item.desc}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-bottom">
          <div className="blockchain-card">
            <div className="sync-dot-pulse"></div>
            <div>
              <p className="blockchain-title">Blockchain Synced</p>
              <p className="blockchain-meta">Block #18,42,209 · 2s ago</p>
            </div>
          </div>

          <div className="user-profile-badge">
            <div className="avatar-initials">PO</div>
            <div className="user-info">
              <p className="user-name">Procurement Officer</p>
              <p className="user-role">Mandi Code: RJ-JPR-04</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">{children}</main>
    </div>
  );
}

export default AdminLayout;
