import { Navigate, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <h1>My Notes</h1>

      <p>Keep your thoughts organized in one simple place.</p>

      <button onClick={() => navigate("/create")}>Create a Note</button>
      <button onClick={() => navigate("/notes")}>View Notes</button>
    </div>
  );
}

export default Home;