import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import NoteCard from "../components/NoteCard"
import Controls from "../components/Controls";

const NotesPage = () => {
  const { notes, setNotes } = useContext(NoteContext);

  return (
    <div>
      {notes.map(note => 
        <NoteCard key={note.$id} note={note}/>
      )}
      <Controls />
    </div>
  )
}

export default NotesPage