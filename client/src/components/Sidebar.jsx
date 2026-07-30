import { useNavigate, NavLink } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "My Career", path: "/my-career" },
    { label: "Learning Modules", path: "/learning-modules" },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">
          PathPilot
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Career Learning Ecosystem
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">
            Student
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Keep learning, keep progressing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;