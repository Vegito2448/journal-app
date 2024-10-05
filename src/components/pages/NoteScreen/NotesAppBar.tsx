import moment from "moment";
import { ChangeEvent, useRef } from "react";
import { useUpdateNoteMutation } from "../../../store";
import { Note } from "../../../types";
import { uploadImage } from "../../../utils";

export const NotesAppBar = (note: Note) => {

  const [updateNote] = useUpdateNoteMutation();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateNote({
      ...note
    });
  };

  const handlePictureClick = () => {

    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const secureUrl = await uploadImage(file);
        return updateNote({
          ...note,
          url: secureUrl
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div
      className="notes__appbar"
    >
      <span>
        {moment(note.date).format('dddd, MMMM Do YYYY')}
      </span>

      <div>
        <input type="file"
          name="file"
          id="file"
          style={{ display: 'none' }}
          ref={fileRef}
          onChange={handleFileChange}

        />
        <button
          className="btn"
          onClick={handlePictureClick}
        >
          Picture
        </button>

        <button
          className="btn"
          onClick={handleSave}
        >
          Save
        </button>
      </div>


    </div>
  );
};
