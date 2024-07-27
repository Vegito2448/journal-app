
export const JournalEntry = () => {
  return (
    <div
      className="journal__entry pointer    "
    >

      <div
        className="journal__entry-picture"
        style={{
          backgroundSize: "cover",
          backgroundImage: "url(https://via.placeholder.com/150)",
          backgroundPosition: "center"
        }}
      />

      <div className="journal__entry-body">
        <p className="journal__entry-title">
          A new day
        </p>
        <p className="journal__entry-content">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos, quae.
        </p>
      </div>

      <div
        className="journal__entry-date-box"
      >
        <span>Monday</span>
        <h4>28</h4>
      </div>



    </div>
  );
};
