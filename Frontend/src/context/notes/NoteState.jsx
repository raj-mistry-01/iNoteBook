import NoteContext from "./NoteContext.jsx";
import { useEffect, useState } from "react";
import { useToast } from "../notification/ToastContext.jsx";
import API_URL from "../../config/api.jsx";


const NoteState = (props) => {
  const { notify } = useToast();
  const host = API_URL
  const notesIntial = []
  const deletedNOtes = []
  const [notes, setnotes] = useState(notesIntial)
  const [delNotes, setdelNotes] = useState(deletedNOtes)
  const [loading, setloading] = useState(false)

  const fetchAllNotes = async () => {
    setloading(true)
    const response = await fetch(`${host}/notes/fetchnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("authToken")
      }
    })
    const json = await response.json()
    setloading(false)
    setnotes(json)
    return json
  }

  const fetchAllDelNotes = async () => {
    setloading(true);
    try {
      const response = await fetch(`${host}/notes/fetchdeletednotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("authToken"),
        },
      });
      const json = await response.json();
      console.log("Fetched notes:", json);
      setdelNotes(json);
      return response;
    } catch (error) {
      console.error("Error fetching deleted notes:", error);
    } finally {
      setloading(false);
    }
  };
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("authToken")
      },
      body: JSON.stringify({ title, description, tag })
    })
    const json = response.json()
    const newNotetoadd = {
      title: title,
      description: description,
      tag: tag,
    }
    setnotes(notes.concat(newNotetoadd))
    return response;
  }
  // delete a note
  const deleteNote = async (id) => {
    const note = await fetch(`${host}/notes/fetchANote/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const notejson = await note.json()
    const { title, description, tag } = notejson.note
    const response1 = await fetch(`${host}/notes/addIntoDelete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("authToken")
      },
      body: JSON.stringify({ title, description, tag })
    })
    const json1 = await response1.json()
    console.log(json1)
    const response = await fetch(`${host}/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("authToken")
      },
    })
    const newNotes = notes.filter((note) => { return note._id !== id })
    setnotes(newNotes)
    if (response.ok) {
      notify("Note Deleted successfully", "success");
    }
    else {
      notify('Some error occured', "error")
    }
  }
  // update a note
  const editNote = async (id, title, description, tag) => {
    // api call
    const response = await fetch(`${host}/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("authToken")
      },
      body: JSON.stringify({ title, description, tag })
    })
    const json = await response.json()
    let newNotes = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title
        newNotes[index].description = description
        newNotes[index].tag = tag
        break
      }
    }
    if (response.ok) {
      notify("Note Updated Successfully", "success");
    }
    else {
      notify("Some Error Occured", "error")
    }
    setnotes(newNotes)
  }

  const handleRecycle = async (note, id) => {
    const { description, tag, title } = note
    addNote(title, description, tag)
    const response = await fetch(`${host}/notes/deletenote1/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("authToken")
      },
    })
    const newNotes1 = delNotes.filter((note) => { return note._id !== id })
    setdelNotes(newNotes1)
    if (response.ok) {
      notify("Note Recycled succesfully", 'success');
    }
    else {
      notify("Note recycle Failed", 'error');

    }
  }
  const downloadTheNote = async (note) => {
    console.log(note)
    const noteWithEmail = {
      ...note,
    }
    console.log(" yes downloading")
    try {
      const response = await fetch(`${host}/notes/downloadNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteWithEmail)
      });

      if (!response.ok) {
        // throw new Error('Failed to fetch the PDF.');
        notify("Note Download failed due to some error", "error")
      }
      notify("Note Downloaded Successfully", "success")
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'note.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      // setError('Failed to download PDF. Please try again.');
    }
  }


  const downloadAllNotes = async () => {
    const notedtoDownLoad = await fetchAllNotes()
    console.log(notedtoDownLoad)
    const notesToSend = notedtoDownLoad.map(note => ({
      title: note.title,
      description: note.description,
      tag: note.tag,
      date: note.date,  // You can use the current date or any date from the note
      email: localStorage.getItem("email") // Get the email from localStorage
    }));
    try {
      const response = await fetch("http://localhost:5000/downloadAllNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notesToSend)
      });
      if (!response.ok) {
        throw new Error('Failed to send notes to the backend.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'note.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      const result = await response.json(); // Handle response if necessary
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Error sending notes:", error);
    }
  }
  return (
    <NoteContext.Provider value={{ notes, setnotes, addNote, deleteNote, editNote, fetchAllNotes, loading, handleRecycle, delNotes, fetchAllDelNotes, downloadTheNote, downloadAllNotes }}> {/**fetchAllDelNotes */}
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState