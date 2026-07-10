import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import "./VendorDashboard.css";
import "./AdminDashboard.css";

const tabs = ["Pending Applications", "All Users"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("Pending Applications");
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  // Guard — only admin can see this page
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/signin");
    }
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "Pending Applications") {
      fetchApplications();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  async function fetchApplications() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/vendor/applications", {
        headers: { "x-user-id": user._id },
      });
      const data = await res.json();
      setApplications(data);
    } catch {
      console.error("Failed to fetch applications");
    }
    setLoading(false);
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/admin/users", {
        headers: { "x-user-id": user._id },
      });
      const data = await res.json();
      setUsers(data);
    } catch {
      console.error("Failed to fetch users");
    }
    setLoading(false);
  }

  async function handleDecision(vendorId, decision) {
    try {
      const res = await fetch(`http://localhost:3000/api/vendor/${decision}/${vendorId}`, {
        method: "PATCH",
        headers: { "x-user-id": user._id },
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`Application ${decision}d successfully.`);
        setTimeout(() => setActionMessage(""), 3000);
        fetchApplications(); // refresh the list
      } else {
        setActionMessage(data.message || "Something went wrong.");
      }
    } catch {
      setActionMessage("Failed to connect to server.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/signin");
  }

  const pendingCount = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link to="/" className="brand">
          Counter<span>AI</span>
        </Link>
        <p className="sidebar-label">Admin Dashboard</p>

        <nav className="sidebar-nav">
          <a
            href="#"
            className={activeTab === "Pending Applications" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); setActiveTab("Pending Applications"); }}
          >
            Applications
            {pendingCount > 0 && (
              <span className="admin-badge">{pendingCount}</span>
            )}
          </a>
          <a
            href="#"
            className={activeTab === "All Users" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); setActiveTab("All Users"); }}
          >
            All Users
          </a>
        </nav>

        <div className="profile-box card">
          <div className="avatar-circle">AD</div>
          <div>
            <p className="profile-name">{user?.name || "Admin"}</p>
            <p className="profile-location">CounterAI Admin</p>
          </div>
        </div>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1>
              {activeTab === "Pending Applications"
                ? "Vendor Applications 📋"
                : "Registered Users 👥"}
            </h1>
            <p>
              {activeTab === "Pending Applications"
                ? "Review and approve or reject vendor applications."
                : "All customers and vendors registered on CounterAI."}
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Tab switcher */}
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={"pill-btn" + (activeTab === tab ? " active" : "")}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === "Pending Applications" && pendingCount > 0 && (
                <span className="tab-count">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {actionMessage && (
          <div className="admin-action-msg">{actionMessage}</div>
        )}

        {loading ? (
          <div className="admin-loading">Loading…</div>
        ) : activeTab === "Pending Applications" ? (
          <ApplicationsTable
            applications={applications}
            onDecision={handleDecision}
          />
        ) : (
          <UsersTable users={users} />
        )}
      </main>
    </div>
  );
}

// ── Applications Table ────────────────────────────────────────────────────────

function ApplicationsTable({ applications, onDecision }) {
  const [filter, setFilter] = useState("pending");

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  const statusColors = {
    pending: "badge-purple",
    approved: "badge-green",
    rejected: "badge-gray",
  };

  return (
    <div className="card panel">
      <div className="filter-row" style={{ marginBottom: "1rem" }}>
        {["pending", "approved", "rejected", "all"].map((s) => (
          <button
            key={s}
            className={"pill-btn" + (filter === s ? " active" : "")}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="admin-empty">No applications in this category.</p>
      ) : (
        <table className="orders-table admin-table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Category</th>
              <th>Location</th>
              <th>Phone</th>
              <th>Menu Description</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app._id}>
                <td className="admin-business-name">{app.businessName}</td>
                <td>{app.category}</td>
                <td>{app.location}</td>
                <td>{app.phone}</td>
                <td className="admin-desc-cell">{app.menuDescription || "—"}</td>
                <td className="time-cell">
                  {new Date(app.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <span className={"badge " + statusColors[app.status]}>
                    {app.status}
                  </span>
                </td>
                <td>
                  {app.status === "pending" ? (
                    <div className="admin-actions">
                      <button
                        className="admin-approve-btn"
                        onClick={() => onDecision(app._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="admin-reject-btn"
                        onClick={() => onDecision(app._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="done-label">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Users Table ───────────────────────────────────────────────────────────────

function UsersTable({ users }) {
  const [search, setSearch] = useState("");

  const roleColors = {
    customer: "badge-blue",
    vendor: "badge-green",
    admin: "badge-purple",
  };

  const filtered = users.filter(
    (u) =>
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card panel">
      <input
        className="search-input"
        type="text"
        placeholder="Search name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", width: "260px" }}
      />

      {filtered.length === 0 ? (
        <p className="admin-empty">No users found.</p>
      ) : (
        <table className="orders-table admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="customer-name-cell">
                    <div className="customer-avatar">{u.name.charAt(0)}</div>
                    {u.name}
                  </div>
                </td>
                <td className="email-cell">{u.email}</td>
                <td>
                  <span className={"badge " + (roleColors[u.role] || "badge-gray")}>
                    {u.role}
                  </span>
                </td>
                <td className="time-cell">
                  {new Date(u.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}