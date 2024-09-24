import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { ReactiveSwal } from "../../components";
import { db } from "../../firebase";
import { Note } from "../../types";
import { AppDispatch, RootState } from "../store";
// Fetching notes with firebase

const LoadingNoteAlert = (title: string) => ReactiveSwal.fire({
  title: title || 'Saving Note',
  allowOutsideClick: false,
  didOpen: () => {
    ReactiveSwal.showLoading();
  }
});

const ErrorNoteAlert = (error: Error | string) => ReactiveSwal.fire({
  icon: 'error',
  title: 'Error',
  text: 'An error occurred; Error: ' + (typeof error === 'string' ? error : error?.message || ''),
});


export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Notes", "ActiveNote"],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], void>({
      keepUnusedDataFor: 3600,
      async queryFn(_, queryApi) {
        try {


          const { auth: { user } } = queryApi.getState() as RootState;
          if (!user) throw new Error("User not found");
          LoadingNoteAlert('Loading Notes...');

          const notesRef = collection(db, `${user.uid}/journal/notes`);

          const querySnapshot = await getDocs(notesRef);

          const notes: Note[] = [];
          if (!querySnapshot.empty)
            querySnapshot.forEach((doc) => {

              const note = doc.data();

              notes.push({
                id: doc.id,
                ...note,
                date: (note.date as Timestamp).toDate().toISOString()
              } as Note);

            });

          ReactiveSwal.close();

          return { data: notes };
        } catch (error) {
          const err = error as Error;
          ErrorNoteAlert(err);
          return { error: err?.message || err || "An error occurred" };
        }
      },
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
          [
            ...result.map(({ id }) => ({ type: 'Notes', id } as const)),
            { type: 'Notes', id: 'LIST' },
          ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Notes', id: 'LIST' }` is invalidated
          [{ type: 'Notes', id: 'LIST' }],
    }),
    getActiveNote: builder.query<Note | null, void>({
      keepUnusedDataFor: 3600,
      async queryFn(_, queryApi) {
        try {
          const { auth: { user } } = queryApi.getState() as RootState;
          if (!user) throw new Error("User not found");
          LoadingNoteAlert('Loading Note...');

          const journalDocRef = doc(db, `${user.uid}/journal`);
          const journalDoc = await getDoc(journalDocRef);

          if (journalDoc.exists()) {
            const activeNote = journalDoc.data().active as Note;

            ReactiveSwal.close();
            return {
              data: activeNote ? {
                ...activeNote,
                date: (activeNote.date as Timestamp).toDate().toISOString()
              } : null
            };
          } else {
            ReactiveSwal.close();

            return { data: null }; // Or throw an error if the journal document doesn't exist
          }
        } catch (error) {
          const err = error as Error;

          ErrorNoteAlert(err);

          return { error: err?.message || err || "An error occurred" };
        }
      },
      providesTags: ['ActiveNote']
    }),
    addNote: builder.mutation({
      async queryFn(_, api) {
        try {

          const { auth: { user } } = api.getState() as RootState;

          if (!user) throw new Error("User not found");
          LoadingNoteAlert('Creating Note...');

          const note = {
            title: "New Note",
            body: "New Note Body",
            url: "",
            date: new Date(),
          };

          const notesRef = await addDoc(collection(db, `${user.uid}/journal/notes`), note);

          const createdNote: Note = {
            ...note,
            id: notesRef.id,
          };

          if (!notesRef.id) throw new Error("Note not created");

          await setDoc(doc(db, `${user.uid}/journal`), {
            active: createdNote,
          }, { merge: true });

          ReactiveSwal.close();

          return {
            data: {
              ...createdNote,
              date: (createdNote.date as Date).toISOString(),
            }
          };

        } catch (error) {
          const err = error as Error;
          ErrorNoteAlert(err);
          return { error: err?.message || err || "An error occurred" };
        }
      },
      invalidatesTags: [{ type: 'Notes', id: 'LIST' }, 'ActiveNote'],

    }),
    setActiveNote: builder.mutation<Note | null, Note | null>({
      async queryFn(note, api) {


        try {

          const { auth: { user } } = api.getState() as RootState;

          if (!user) throw new Error("User not found");
          LoadingNoteAlert('Loading...');
          // Update the journal document with the active note
          await setDoc(doc(db, `${user.uid}/journal`), {
            active: note ? {
              ...note,
              date: new Date(note.date as string),
            } : null,
          }, { merge: true });
          ReactiveSwal.close();
          return { data: note || null };
        } catch (error) {

          const err = error as Error;

          ErrorNoteAlert(err);

          return { error: err?.message || err || "An error occurred" };
        }
      },
      invalidatesTags: ['ActiveNote'],
    }),
    updateNote: builder.mutation<Note, Note>({
      async queryFn({ id, ...note }, api) {
        try {
          const { auth: { user } } = api.getState() as RootState;
          if (!user) throw new Error("User not found");
          LoadingNoteAlert('Saving...');

          const noteRef = doc(db, `${user.uid}/journal/notes/${id}`); // Added id to the path
          await updateDoc(noteRef, { ...note, date: new Date(note.date as string) });

          await api.dispatch(notesApi.endpoints.setActiveNote.initiate({ id, ...note }));

          // No need to check noteRef.id as updateDoc doesn't return a new id

          ReactiveSwal.close();

          return { data: { id, ...note } };
        } catch (error) {
          const err = error as Error;

          ReactiveSwal.close();

          ErrorNoteAlert(err);

          return { error: err?.message || err || "An error occurred" };
        }
      },
      invalidatesTags: ['Notes', 'ActiveNote'],
    }),
    deleteNote: builder.mutation<string, string>({
      async queryFn(id, api) {
        try {
          const { auth: { user } } = api.getState() as RootState;
          if (!user) throw new Error("User not found");
          LoadingNoteAlert('Deleting...');

          // Set active note to null


          // Delete the note
          const noteRef = doc(db, `${user.uid}/journal/notes/${id}`);

          await deleteDoc(noteRef);

          await api.dispatch(notesApi.endpoints.setActiveNote.initiate(null));



          ReactiveSwal.close();
          return { data: id };
        } catch (error) {
          const err = error as Error;
          ReactiveSwal.close();
          ErrorNoteAlert(err);
          return { error: err?.message || err || "An error occurred" };
        }
      },
      invalidatesTags: ['Notes'],
    }),
  })
});

export const invalidateAllTags = () => (dispatch: AppDispatch) => {
  dispatch(notesApi.util.invalidateTags(['Notes', 'ActiveNote']));
};

export const { useGetNotesQuery, useAddNoteMutation, useGetActiveNoteQuery, useSetActiveNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } = notesApi;

