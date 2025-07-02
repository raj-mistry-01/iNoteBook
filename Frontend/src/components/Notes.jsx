import React, { useCallback } from "react";
import { useContext } from "react";
import NoteItem from "./NoteItem";
import NoteContext from "../context/notes/NoteContext.jsx";
import { useEffect } from "react";
import AddNote from "./AddNote";
import { useRef } from "react";
import { useState } from "react";
import Loading from "./Loading";
import {useNavigate} from "react-router-dom"


function Notes(props) {
  return (
    <>
      <AddNote showAlert = {props.showAlert}/>
    </>
  );
}

export default Notes;
