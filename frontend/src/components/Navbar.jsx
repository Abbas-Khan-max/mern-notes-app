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
      <Link to="/">Home</Link> | {" "}

      {token ? (
        <>
          <Link to="/notes">Notes</Link> | {" "}
          <Link to="/create">Create Note</Link> | {" "}
          <Link to="/trash">Trash</Link> | {" "}
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | {" "}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;