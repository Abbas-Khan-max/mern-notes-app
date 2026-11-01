import { useNavigate, useParams } from "react-router-dom";

function NoteDetails({ notes }) {
    const navigate = useNavigate();
    const {id} = useParams();
    const note = notes.find((item) => {
        return item._id === id;
    });
    if (!note){
        return <p>Note not found!</p>
    }
    return(
        <div className="note-details">
            <h1>Note Details</h1>
          
            <div>
                <h2>{note.title}</h2>
                <p>{note.description}</p>
                <button 
                className="back-button"
                onClick={() => navigate("/notes")}>Back to Notes</button>
            </div>
        </div>
    );
}

export default NoteDetails;