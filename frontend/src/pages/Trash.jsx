import { useEffect, useState } from "react";

function Trash({ notes, setNotes }) {
  const [trash, setTrash] = useState([]);
  const [error, setError] = useState("");

  // Get trashed notes from MongoDB when Trash page opens
  useEffect(() => {
    const getTrash = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in first!");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notes/trash`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch trash"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Trash API did not return an array");
        }

        setTrash(data);
      } catch (error) {
        setError(error.message);
      }
    };

    getTrash();
  }, []);

  // Restore note
  async function handleRestore(note) {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in first!");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${note._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            isTrashed: false
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to restore note");
      }

      // Remove restored note from Trash
      setTrash((currentTrash) =>
        currentTrash.filter((item) => item._id !== data._id)
      );

      // Add restored note back to active notes
      setNotes((currentNotes) => [...currentNotes, data]);
    } catch (error) {
      setError(error.message);
    }
  }

  // Permanently delete one note
  async function handlePermanentDelete(note) {
    const answer = confirm(
      `Are you sure you want to permanently delete "${note.title}"?`
    );

    if (!answer) {
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in first!");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${note._id}/permanent`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to permanently delete note"
        );
      }

      // Remove permanently deleted note from Trash
      setTrash((currentTrash) =>
        currentTrash.filter((item) => item._id !== data._id)
      );
    } catch (error) {
      setError(error.message);
    }
  }

  // Permanently delete all trashed notes
  async function handleEmptyTrash() {
    const answer = confirm(
      "Are you sure you want to empty the trash?"
    );

    if (!answer) {
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in first!");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/trash/empty`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to empty trash");
      }

      // MongoDB has been emptied, so clear React Trash state
      setTrash([]);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="trash-page">
      <div className="trash-header">
        <div>
          <h1>Trash</h1>
          <p>{trash.length} deleted notes</p>
        </div>

        {trash.length > 0 && (
          <button
            className="empty-trash-button"
            onClick={handleEmptyTrash}
            title="Empty Trash"
            aria-label="Empty Trash"
          >
            🗑️
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {trash.length === 0 ? (
        <p>Trash is empty!</p>
      ) : (
        trash.map((note) => (
          <div className="trash-card" key={note._id}>
            <h2>{note.title}</h2>

            <p>{note.description}</p>

            <button
              className="restore-button"
              onClick={() => handleRestore(note)}
            >
              Restore
            </button>

            <button
              className="permanent-delete-button"
              onClick={() => handlePermanentDelete(note)}
            >
              Delete Permanently
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Trash;