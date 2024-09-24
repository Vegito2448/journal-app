import moment from "moment";
import { ChangeEvent, useRef } from "react";
import { useUpdateNoteMutation } from "../../../store";
import { Note } from "../../../types";
import { ReactiveSwal } from "../../ui";

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
      const cloudUrl = 'https://api.cloudinary.com/v1_1/m1dxr7hw/image/upload';

      const formData = new FormData();

      formData.append('file', file);
      formData.append('upload_preset', 'm1dxr7hw');
      formData.append('api_key', '685115225575362');

      try {
        const resp = await fetch(cloudUrl, {
          method: 'POST',
          body: formData,

        });
        const cloudResp = await resp.json();

        if (!resp.ok) throw cloudResp;

        return updateNote({
          ...note,
          url: cloudResp.secure_url
        });

      } catch (error) {
        const err = error as Error;
        ReactiveSwal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.message || 'An error occurred while uploading the image'
        });
      }


    }

  }

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
