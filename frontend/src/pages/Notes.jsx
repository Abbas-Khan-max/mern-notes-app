  import { useState } from "react";
  import { useNavigate } from "react-router-dom";


  function Notes({notes , setNotes }) {
    const navigate = useNavigate();
    const [search , setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    if (notes.length === 0) {
      return(
        <div>
          <h1>All Notes</h1>
          <p>No notes are available!</p>
          <button onClick={() => navigate("/create")}>Create Newnote</button>
        </div>
      );
    }
    const filteredNotes = notes.filter((note) => {

      const title  = 
        typeof note.title === "string" ? note.title : "";  

      const description = 
        typeof note.description === "string" ? note.description : "";
        
      return (
        title.toLowerCase().includes(search.toLowerCase()) ||  
        description.toLowerCase().includes(search.toLowerCase())
      );
    }); 
    const sortedNotes = [...filteredNotes].sort((a,b) => {
      if (sortBy === "titleAZ") {
      return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "titleZA") {
        return (b.title || "").localeCompare(a.title || "");
      }
      if (sortBy === "oldest") {
        return new Date(a.updatedAt) - new Date(b.updatedAt);                                             
      }
      
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    
    });
    function getTimeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} days ago`;
}
  return (
    <div className="notes-page">
      <h1>All Notes</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search.length !== 0 && (
        <button onClick={() => setSearch("")}>
          Clear
        </button>
      )}
      {filteredNotes.length > 0 && (
        <p>
          {filteredNotes.length === 1
          ? "1 Note Found" : `${filteredNotes.length} Notes Found`}
        </p>
      )} 

    <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="titleAZ">Title A-Z</option>
      <option value="titleZA">Title Z-A</option>
    </select>
      {filteredNotes.length === 0 ? (
        <p>No notes found matching "{search}".</p>
      ) : (
        sortedNotes.map((note) => (
          <div className="note-card" key={note._id}>
            <h2>{note.title}</h2>
            <p>
              {typeof note.description === "string"
                ? note.description.length > 100
                  ? note.description.slice(0, 100) + "..."
                  : note.description
                : ""}
                </p>
              <p>
                created: {new Date(note.createdAt).toLocaleString()}
              </p>
              <p>
                Updated: {getTimeAgo(note.updatedAt)}
              </p>

            <button className="delete-button" onClick={() => handleDelete(note)}>
              Delete
            </button>

            <button className="edit-button" onClick={() => navigate(`/edit/${note._id}`)}>
              Edit
            </button>
            <button  className="view-button" onClick={() => navigate(`/notes/${note._id}`)}>
              View Note
              </button>
          </div>
        ))
      )}
    </div>
  );  

async function handleDelete(note) {

  const answer = confirm(
    `Are you sure you want to delete this note: "${note.title}"..?`
  );

  if (answer === false) {
    return;
  }

  try {
    const token  = localStorage.getItem("token");

    if (!token) {
      throw new Error ("Please login first!")
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/notes`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }
    );

    if (!response.ok) {
      const data = await response.json();

      throw new Error(
        data.messagae || "Failed to delete note"
      );
    }

    const deletedNote = await response.json();

    const updatedNotes = notes.filter((item) => {
      return item._id !== deletedNote._id;
    });

    setNotes(updatedNotes);
  } catch (error) {
    console.error(error);
  }
 }

}


  export default Notes;