import { FaRegCalendar, FaRegMoon } from "react-icons/fa6";
import { JournalEntries } from '..';

export const Sidebar = () => {
  return (
    <aside
      className="journal__sidebar"
    >
      <header
        className="journal__sidebar-navbar"
      >
        <h3
          className="mt-5"
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <FaRegMoon
            title="Journal App"

            size={20}
          />

          <span>Journal App</span>
        </h3>

        <button type="button"
          className="btn"
        >Logout</button>

      </header>
      <div className="journal__new-entry">
        <FaRegCalendar
          size={100}
          title="New Entry"
        />
        <p
          className="mt-5"
        >New Entry</p>
      </div>

      <JournalEntries />

    </aside>
  );
};
