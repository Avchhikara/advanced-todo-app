
const notesArea = document.querySelector('.notes-area');

import { addNote, createNotes } from "./node.js";

notesArea.addEventListener("dblclick", addNote);


createNotes();