import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import NoteDetails from "./pages/NoteDetails";
import Trash from "./pages/Trash.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

// Protect pages that require login
function ProtectedRoute({ token, children }) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [notes, setNotes] = useState([]);

  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (!token) {
      setNotes([]);
      return;
    }

    const getNotes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notes`,
          {
            headers: {  
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch notes"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "The notes API did not return an array"
          );
        }

        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]);
      }
    };

    getNotes();
  }, [token]);

  return (
    <BrowserRouter>
      <Navbar
        token={token}
        setToken={setToken}
        setNotes={setNotes}
      />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login setToken={setToken} />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected pages */}
        <Route
          path="/notes"
          element={
            <ProtectedRoute token={token}>
              <Notes
                notes={notes}
                setNotes={setNotes}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute token={token}>
              <CreateNote
                notes={notes}
                setNotes={setNotes}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute token={token}>
              <EditNote
                notes={notes}
                setNotes={setNotes}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute token={token}>
              <NoteDetails notes={notes} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trash"
          element={
            <ProtectedRoute token={token}>
              <Trash
                notes={notes}
                setNotes={setNotes}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;