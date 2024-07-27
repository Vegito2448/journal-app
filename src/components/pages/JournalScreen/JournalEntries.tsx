import { JournalEntry } from "./JournalEntry";

export const JournalEntries = () => {

  const entries = Array.from({ length: 10 }).map((_, i) => i + 1);

  return (
    <div
      className="journal__entries"
    >
      {
        entries.map(entry => (
          <JournalEntry
            key={entry}

          />
        ))
      }
    </div>
  );
};
