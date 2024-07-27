
export const NotesAppBar = () => {
  return (
    <div
      className="notes__appbar"
    >
      <span>28 de agosto 2020</span>

      {/* <input
        type="text"
        placeholder="Some awesome title"
        className="notes__title-input"
        autoComplete="off"
      /> */}

      <div>
        <button
          className="btn"
        >
          Picture
        </button>

        <button
          className="btn"
        >
          Save
        </button>
      </div>


    </div>
  );
};
