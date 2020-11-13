import { getParsedText } from "./markdown.js";

const notesArea = document.querySelector(".notes-area");

export function addNote(e) {
  const noteBox = createNote(null, null, null, e);
  saveNoteData(noteBox);
  notesArea.appendChild(noteBox);
}

export function createNotes() {
  const notes = JSON.parse(localStorage.getItem("notes"));
  for (let note in notes) {
    const { top, left, value } = notes[note];
    notesArea.appendChild(createNote(note, top, left, null, value));
  }
}

function createNote(id, top, left, e, value) {
  const noteBox = document.createElement("div");
  const textArea = document.createElement("textarea");
  const previewElement = document.createElement("div");
  const deleteButton = document.createElement("button");
  const moveButton = document.createElement("button");
  const upperArea = document.createElement("div");
  const lowerArea = document.createElement("div");
  const hintOnPreview = document.createElement("div");
  noteBox.id = id || new Date().toISOString().toString();
    deleteButton.textContent = "Delete";
  deleteButton.innerHTML = `<i class="fa fa-trash-o" aria-hidden="true"></i>`;
  moveButton.innerHTML = `<i class="fa fa-arrows-alt" aria-hidden="true"></i>`;
  previewElement.hidden = true;
  previewElement.className = "preview-element";
  hintOnPreview.textContent = "click on text above to edit it ;)";
  hintOnPreview.className = "small-text";
  hintOnPreview.hidden = true;
  lowerArea.appendChild(textArea);
  lowerArea.appendChild(previewElement);
  lowerArea.appendChild(hintOnPreview);
  upperArea.appendChild(moveButton);
  upperArea.appendChild(deleteButton);
  noteBox.appendChild(upperArea);
  noteBox.appendChild(lowerArea);
  noteBox.className = "note";
  noteBox.style.top = top || `${e.clientY}px`;
  noteBox.style.left = left || `${e.clientX}px`;
  textArea.textContent = ``;
  textArea.placeholder =
    "Jot down something here 😉. We only support bold and italics in markdown for now!";
  if (value) textArea.value = value;
  textArea.oninput = () => saveNoteData(noteBox, textArea);
  deleteButton.onclick = () => removeNote(noteBox);
  moveButton.onmousedown = (e) => {
    moveNote(e, noteBox, textArea);
  };
  textArea.onblur = (e) =>
    showMarkdownPreview(e, textArea, previewElement, hintOnPreview);
  previewElement.onclick = (e) =>
    showTextArea(e, textArea, previewElement, hintOnPreview);
  return noteBox;
}

function saveNoteData(noteBox, textArea) {
  const key = noteBox.id;
  const value = textArea ? textArea.value: "";
  const notes = JSON.parse(localStorage.getItem("notes")) || {};
  notes[key] = {
    value,
    top: noteBox.style.top,
    left: noteBox.style.left,
  };
  localStorage.setItem("notes", JSON.stringify(notes));
}

function showMarkdownPreview(e, textarea, previewElement, hintOnPreview) {
  textarea.hidden = true;
  const value = getParsedText(textarea) || "Click here to write something down";
  previewElement.innerHTML = value;
  previewElement.hidden = false;
  hintOnPreview.hidden = false;
}

function showTextArea(e, textarea, previewElement, hintOnPreview) {
  textarea.hidden = false;
  previewElement.hidden = true;
  textarea.autofocus = true;
  hintOnPreview.hidden = true;
}

function removeNote(noteBox) {
  const id = noteBox.id;
  const notes = JSON.parse(localStorage.getItem("notes"));
  delete notes[id];
  localStorage.setItem("notes", JSON.stringify(notes));
  noteBox.remove();
}

function moveNote(e, noteBox, textArea) {
  // Also add specific classes here
  noteBox.classList.add("note-on-move");
  noteBox.style.position = "absolute";
  noteBox.style.zIndex = 1000;
  noteBox.style.left = e.clientX + "px";
  noteBox.style.top = e.clientY + "px";

  const onMouseMove = (e) => {
    noteBox.style.left = e.clientX + "px";
    noteBox.style.top = e.clientY + "px";
  };

  notesArea.addEventListener("mousemove", onMouseMove);

  noteBox.onmouseup = () => {
    notesArea.removeEventListener("mousemove", onMouseMove);
    saveNoteData(noteBox, textArea);
    noteBox.onmouseup = null;
    noteBox.classList.remove("note-on-move");
    noteBox.style.zIndex = 10;
  };

  noteBox.ondragstart = () => false;
}
