import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditNote({ notes, setNotes }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const note = notes.find((item) => item._id === id);

  const [title, setTitle] = useState(note ? note.title : "");
  const [description, setDescription] = useState(
    note ? note.description : ""
  );
  const [error, setError] = useState("");

  if (!note) {
    return <p>Note not found!</p>;
  }

  async function handleUpdate() {
    if (title.trim() === "" || description.trim() === "") {
      setError("Please fill the title and description to save!");
      return;
    }

    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first!");
      return;
    }
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            
            title: title.trim(),
            description: description.trim()
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note!");
      }

      const updatedNote = await response.json();

      const updatedNotes = notes.map((item) => {
        if (item._id === id) {
          return updatedNote;
        }

        return item;
      });

      setNotes(updatedNotes);

      navigate("/notes");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="edit-note">
      <h1>Edit Note</h1>

      <input
        className="note-input"
        type="text"
        value={title}
        placeholder="Edit title..."
        onChange={(e) => {
          setTitle(e.target.value);
          setError("");
        }}
      />

      <textarea
        className="note-textarea"
        value={description}
        placeholder="Edit description..."
        onChange={(e) => {
          setDescription(e.target.value);
          setError("");
        }}
      />

      {error && <p className="error-message">{error}</p>}

      <div className="edit-buttons">
        <button
          className="cancel-button"
          onClick={() => navigate("/notes")}
        >
          Cancel
        </button>

        <button
          className="save-button"
          onClick={handleUpdate}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditNote;