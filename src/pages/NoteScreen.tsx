import { NotesAppBar } from "../components";

export const NoteScreen = () => {
  return (
    <div
      className="notes__main-content animate__animated animate__fadeIn animate__faster"
    >

      <NotesAppBar

      />

      <div className="notes__content">
        <input
          type="text"
          placeholder="Some awesome title"
          className="notes__title-input"
          autoComplete="off"
        />

        <textarea
          placeholder="What happened today"
          className="notes__textarea"
        ></textarea>

        <div className="notes__image">
          <img
            src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg"
            alt="imagen"
          />
        </div>
      </div>


    </div>
  );
};
