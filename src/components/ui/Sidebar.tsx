import { FaRegCalendar, FaRegMoon } from "react-icons/fa6";
import { JournalEntries } from '..';
import { invalidateAllTags, useAddNoteMutation, useAppDispatch, useAppSelector, userLogout } from "../../store";

export const Sidebar = () => {
  const { user } = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();

  const [addNote] = useAddNoteMutation();

  const handleLogout = () => {
    dispatch(userLogout());
    dispatch(invalidateAllTags());
  };

  const handleAddNew = () => {
    addNote(undefined);
  };


  return (user &&
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
          {user.photoURL ?
            <img
              src={user.photoURL}
              alt={user.name}
              style={{
                width: 30,
                height: 30,
                borderRadius: '100%',
                marginRight: 10
              }}
            />
            : <FaRegMoon
            title="Journal App"

            size={20}
            />}

          <span>{user.name || 'Journal App'}</span>
        </h3>

        <button type="button"
          className="btn"
          onClick={handleLogout}
        >Logout</button>

      </header>
      <div
        className="journal__new-entry"
        onClick={handleAddNew}

      >
        <FaRegCalendar
          size={100}
          title="Add Note"
        />
        <p
          className="mt-5"
        >New Entry</p>
      </div>

      <JournalEntries />

    </aside>
  );
};
