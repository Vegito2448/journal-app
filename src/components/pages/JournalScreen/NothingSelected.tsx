import { FaRegStar } from "react-icons/fa6";

export const NothingSelected = () => {
  return (
    <div
      className="nothing__main-content animate__animated animate__fadeIn animate__faster"
    >
      <p>
        Select something
        <br />
        pr create an entry!
      </p>
      <FaRegStar
        size={150}
      />

    </div>
  );
};
