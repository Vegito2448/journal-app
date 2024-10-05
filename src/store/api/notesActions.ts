// notesActions.ts
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { ReactiveSwal } from "../../components";
import { db } from "../../firebase";
import { Note } from "../../types";
import { ErrorNoteAlert, LoadingNoteAlert } from "../../utils/alerts";

export const fetchNotes = async (userUid: string): Promise<Note[]> => {
  try {
    LoadingNoteAlert('Loading Notes...');
    const notesRef = collection(db, `${userUid}/journal/notes`);
    const querySnapshot = await getDocs(notesRef);

    const notes: Note[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Note, 'id'>,
      date: (doc.data().date as Timestamp).toDate().toISOString()
    }));

    ReactiveSwal.close();
    return notes;
  } catch (error) {
    const err = error as Error;
    ErrorNoteAlert(err);
    throw err;
  }
};

export const fetchActiveNote = async (userUid: string): Promise<Note | null> => {
  try {
    LoadingNoteAlert('Loading Note...');
    const journalDocRef = doc(db, `${userUid}/journal`);
    const journalDoc = await getDoc(journalDocRef);

    ReactiveSwal.close();

    if (!journalDoc.exists())
      return null;

    const activeNote = journalDoc.data().active as Note;

    return activeNote ? {
      ...activeNote,
      date: (activeNote.date as Timestamp).toDate().toISOString()
    } : null;

  } catch (error) {
    const err = error as Error;
    ErrorNoteAlert(err);
    throw err;
  }
};

export const createNote = async (userUid: string): Promise<Note> => {
  try {
    LoadingNoteAlert('Creating Note...');
    const note = {
      title: "New Note",
      body: "New Note Body",
      url: "",
      date: new Date(),
    };

    const notesRef = await addDoc(collection(db, `${userUid}/journal/notes`), note);
    const createdNote: Note = { ...note, id: notesRef.id };

    if (!notesRef.id) throw new Error("Note not created");

    await setDoc(doc(db, `${userUid}/journal`), { active: createdNote }, { merge: true });
    ReactiveSwal.close();

    return { ...createdNote, date: (createdNote.date as Date).toISOString() };
  } catch (error) {
    const err = error as Error;
    ErrorNoteAlert(err);
    throw err;
  }
};

export const setActiveNote = async (userUid: string, note: Note | null): Promise<Note | null> => {
  try {
    LoadingNoteAlert('Loading...');
    await setDoc(doc(db, `${userUid}/journal`), {
      active: note ? { ...note, date: new Date(note.date as string) } : null,
    }, { merge: true });
    ReactiveSwal.close();
    return note || null;
  } catch (error) {
    const err = error as Error;
    ErrorNoteAlert(err);
    throw err;
  }
};

export const updateNote = async (userUid: string, note: Note): Promise<Note> => {
  try {
    LoadingNoteAlert('Saving...');
    const noteRef = doc(db, `${userUid}/journal/notes/${note.id}`);
    await updateDoc(noteRef, { ...note, date: new Date(note.date as string) });

    await setActiveNote(userUid, note);
    ReactiveSwal.close();

    return note;
  } catch (error) {
    const err = error as Error;
    ReactiveSwal.close();
    ErrorNoteAlert(err);
    throw err;
  }
};

export const deleteNote = async (userUid: string, noteId: string): Promise<string> => {
  try {
    LoadingNoteAlert('Deleting...');
    const noteRef = doc(db, `${userUid}/journal/notes/${noteId}`);
    await deleteDoc(noteRef);

    await setActiveNote(userUid, null);
    ReactiveSwal.close();
    return noteId;
  } catch (error) {
    const err = error as Error;
    ReactiveSwal.close();
    ErrorNoteAlert(err);
    throw err;
  }
};