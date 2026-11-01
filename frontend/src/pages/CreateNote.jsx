import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateNote({ notes, setNotes }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSave(e) {
    e.preventDefault();

    if (title.trim() === "" || description.trim() === "") {
      setError("Fill all the fields to save!");
      return;
    }

    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in first!");
        return;
      }
      const response = await fetch( 
        `${import.meta.env.VITE_API_URL}/api/notes`, 
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message|| "failed to create note!");
      }

    setNotes([...notes , data]);

      navigate("/notes");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="create-note">
      <h1>Create a New Note</h1>

      <form onSubmit={handleSave}>
        <input
          className="note-input"
          type="text"
          value={title}
          placeholder="Enter your title..."
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
        />

        <textarea
          className="note-textarea"
          value={description}
          placeholder="Enter your description..."
          onChange={(e) => {
            setDescription(e.target.value);
            setError("");
          }}
        />

        {error && <p className="error-message">{error}</p>}

        <button className="save-button" type="submit">
          Save Note
        </button>
      </form>
    </div>
  );
}

export default CreateNote;