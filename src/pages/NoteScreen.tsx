import { useEffect, useRef } from "react";
import { NotesAppBar } from "../components";
import { useForm } from "../hooks";
import { useDeleteNoteMutation } from "../store";
import { Note } from "../types";

export const NoteScreen = (note: Note) => {
  const [deleteNote] = useDeleteNoteMutation();
  const { body, title, handleChange, resetForm } = useForm({ initialState: note });

  const activeId = useRef(note.id);

  useEffect(() => {
    if (note.id !== activeId.current) {
      resetForm(note);
      activeId.current = note.id;
    }
  }, [note, resetForm]);

  const handleDelete = () => {
    deleteNote(note.id);
  }


  return (
    <div
      className="notes__main-content animate__animated animate__fadeIn animate__faster"
    >

      <NotesAppBar
        {...note}
        body={body}
        title={title}
      />

      <div className="notes__content">
        <input
          type="text"
          placeholder="Some awesome title"
          className="notes__title-input"
          autoComplete="off"
          value={title}
          name="title"
          onChange={handleChange}
        />

        <textarea
          placeholder="What happened today"
          className="notes__textarea"
          value={body}
          name="body"
          onChange={handleChange}
        ></textarea>

        {note.url && <div className="notes__image">
          <img
            src={note.url}
            alt="imagen"
          />
        </div>}
      </div>

      <button
        className="btn btn-danger"
        onClick={handleDelete}
      >
        Delete
      </button>

    </div>
  );
};
