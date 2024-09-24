import moment from "moment";
import { useSetActiveNoteMutation } from "../../../store";
import { Note } from "../../../types";

export const JournalEntry = ({ body, title, url, date, id }: Note) => {
  const [setActiveNote, { isLoading }] = useSetActiveNoteMutation();

  const noteDate = moment(date);

  const handleEntryClick = () => {
    const note = {
      id,
      body,
      title,
      url,
      date
    };

    setActiveNote(note);
  }

  return (
    <div
      className={`journal__entry ${!isLoading ? 'pointer' : 'wait'} animate__animated animate__fadeIn animate__faster`}
      onClick={handleEntryClick}
    >

      <div
        className="journal__entry-picture"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(${url || 'https://via.placeholder.com/150'})`,
          backgroundPosition: "center",
        }}
      />

      <div className="journal__entry-body">
        <p className="journal__entry-title">
          {title}
        </p>
        <p className="journal__entry-content">
          {body}
        </p>
      </div>

      <div
        className="journal__entry-date-box"
      >
        <span>{noteDate.format('dddd')}</span>
        <h4>{noteDate.format('Do')}</h4>
      </div>



    </div>
  );
};
