import React, { useEffect, useContext } from "react";
import DeletedNoteItem from "./DeletedNoteItem";
import NoteContext from "../context/notes/NoteContext.jsx";
import Loading from "./Loading";
import { useToast } from "../context/notification/ToastContext.jsx";

function RecycleBin(props) {
    const { fetchAllDelNotes, delNotes, loading } = useContext(NoteContext);
    const { notify } = useToast();
    useEffect(() => {
        const fetchData = async () => {
            if (localStorage.getItem("authToken")) {
                const response = await fetchAllDelNotes();
                console.log(response);
                if (response.ok) {
                    notify("Recycle Bin Fetched Successfully", "success");
                }
            }
            else {
                notify("Please Login First", 'warning');
                navigate("/login");
            }
        };
        fetchData(); // ✅ IIFE pattern
    }, []);
    return (
        <>
            <div className="row mx-3">
                <h2>Your Recycled Notes</h2>
                {delNotes.length === 0 ? <div className="container">No Notes To Display</div> : ""}
                {loading && <Loading />}
                {delNotes.map((note) => {
                    return (
                        <DeletedNoteItem note={note} key={note._id} />
                    );
                })}
            </div>
        </>
    );
}

export default RecycleBin;
