import { NothingSelected } from "../components";
import { useGetActiveNoteQuery } from "../store";
import { NoteScreen } from './NoteScreen';

export const JournalScreen = () => {

  const { data: active, isLoading } = useGetActiveNoteQuery();

  return (
    <>
      {/* <NothingSelected

      /> */}
      {isLoading ? <h1>Loading...</h1> :
        active && !isLoading ? <NoteScreen
          {...active}
        /> :
          <NothingSelected />}
    </>
  );
};
