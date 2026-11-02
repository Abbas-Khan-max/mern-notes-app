import { Link, useNavigate } from "react-router-dom";

function Navbar({ token, setToken, setNotes }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setNotes([]);
    navigate("/login");
  }

return (
  <nav className="navbar">
    <Link to="/" className="nav-brand">Notes App</Link>

    <div className="nav-links">
      <Link to="/" className="nav-link">Home</Link>

      {token ? (
        <>
          <Link to="/notes" className="nav-link">Notes</Link>
          <Link to="/create" className="nav-link">Create Note</Link>
          <Link to="/trash" className="nav-link">Trash</Link>

          <button
            type="button"
            className="nav-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-button login-button">
            Login
          </Link>

          <Link to="/register" className="nav-button register-button">
            Register
          </Link>
        </>
      )}
    </div>
  </nav>
);
}

export default Navbar;