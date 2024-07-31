import React, {useRef, useEffect, useState, useContext} from 'react'
import DeleteButton from './DeleteButton'
import Spinner from '../icons/Spinner'
import { db } from '../appwrite/databases'
import { setNewOffset, autoGrow, setZIndex } from '../utils'
import { NoteContext } from '../context/NoteContext'

const NoteCard = ({note, setNotes}) => {
    const body = JSON.parse(note.body)
    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);
    const [position, setPosition] = useState(JSON.parse(note.position))
    const colors = JSON.parse(note.colors)
    const textAreaRef = useRef(null)
    const cardRef = useRef(null)

    let mouseStartPos = {x:0, y:0}

    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);
     
    const { setSelectedNote } = useContext(NoteContext);

    const mouseDown = (e) => {
        if (e.target.className === "card-header") {
 
            setZIndex(cardRef.current);
     
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;
     
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            setSelectedNote(note);
        }
    }

    const mouseMove = (e) => {
        const mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY
        }

        
        mouseStartPos.x = e.clientX
        mouseStartPos.y = e.clientY

        const newPos = setNewOffset(cardRef.current, mouseMoveDir)

        setPosition(newPos)
    }


    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        const newPosition = setNewOffset(cardRef.current); //{x,y}
        saveData("position", newPosition);
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false)
    };

    const handleKeyUp = () => {
        setSaving(true)
        if(keyUpTimer.current) {
            clearTimeout(keyUpTimer.current)
        }
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value)
        }, 2000)
    }

  return (
    <div className='card' ref={cardRef} style={{backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`
    }}>
        <div className="card-header" onMouseDown={mouseDown} style={{backgroundColor: colors.colorHeader}}>
            <DeleteButton noteId={note.$id}/>
             {
                saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText}/>
                        <span style={{ color: colors.colorText }}>Saving...</span>
                    </div>
                )
             }
        </div>
        <div className="card-body">
            <textarea ref={textAreaRef} onKeyUp={handleKeyUp} onFocus={() => {setZIndex(cardRef.current); setSelectedNote(note);
;}} style={{color: colors.colorText}} defaultValue={body} onInput={() => autoGrow(textAreaRef)}></textarea>
        </div>
    </div>
  )
}

export default NoteCard