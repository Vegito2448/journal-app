import { useGetNotesQuery } from "../../../store";
import { JournalEntry } from "./JournalEntry";

export const JournalEntries = () => {

  const { data: notes, isLoading } = useGetNotesQuery();

  return (
    <div
      className="journal__entries"
    >
      {Boolean(!isLoading && notes && notes.length) &&
        notes!.map(note => (
          <JournalEntry
            key={note.id}
            {...note}
          />
        ))
      }

      <div>
        {isLoading ? 'Loading...' : notes && notes.length === 0 &&
          'There are no notes'
        }
      </div>
    </div>
  );
};
