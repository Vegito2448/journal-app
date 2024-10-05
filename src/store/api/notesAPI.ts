// notesAPI.ts
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Note } from "../../types";
import { AppDispatch, RootState } from "../store";
import { createNote, deleteNote, fetchActiveNote, fetchNotes, setActiveNote, updateNote } from "./notesActions";

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Notes", "ActiveNote"],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], void>({
      keepUnusedDataFor: 3600,
      async queryFn(_, { getState }) {
        try {
          const { auth: { user } } = getState() as RootState;
          if (!user || !user.uid) throw new Error("User not found");

          const notes = await fetchNotes(user.uid);
          return { data: notes };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Notes', id } as const)),
            { type: 'Notes', id: 'LIST' },
          ]
          : [{ type: 'Notes', id: 'LIST' }],
    }),
    getActiveNote: builder.query<Note | null, void>({
      keepUnusedDataFor: 3600,
      async queryFn(_, { getState }) {
        try {
          const { auth: { user } } = getState() as RootState;
          if (!user || !user.uid) throw new Error("User not found");

          const activeNote = await fetchActiveNote(user.uid);
          return { data: activeNote };
        } catch (error) {
          return { error: (error as Error)?.message || 'An error occurred' };
        }
      },
      providesTags: ['ActiveNote']
    }),
    addNote: builder.mutation<Note, void>({
      async queryFn(_, { getState }) {
        try {
          const { auth: { user } } = getState() as RootState;
          if (!user || !user.uid) throw new Error("User not found");

          const createdNote = await createNote(user.uid);
          return { data: createdNote };
        } catch (error) {
          return { error: (error as Error)?.message || 'An error occurred' };
        }
      },
      invalidatesTags: [{ type: 'Notes', id: 'LIST' }, 'ActiveNote'],
    }),
    setActiveNote: builder.mutation<Note | null, Note | null>({
      async queryFn(note, { getState }) {
        try {
          const { auth: { user } } = getState() as RootState;
          if (!user || !user.uid) throw new Error("User not found");

          const updatedNote = await setActiveNote(user.uid, note);
          return { data: updatedNote };
        } catch (error) {
          return { error: (error as Error)?.message || 'An error occurred' };
        }
      },
      invalidatesTags: ['ActiveNote'],
    }),
    updateNote: builder.mutation<Note, Note>({
      async queryFn(note, { getState }) {
        try {
          const { auth: { user } } = getState() as RootState;
          if (!user || !user.uid) throw new Error("User not found");

          const updatedNote = await updateNote(user.uid, note);
          return { data: updatedNote };
        } catch (error) {
          return { error: (error as Error)?.message || 'An error occurred' };
        }
      },
      invalidatesTags: ['Notes', 'ActiveNote'],
    }),
    deleteNote: builder.mutation<string, string>({
      async queryFn(id, { getState, dispatch }) {
        try {
          const { auth: { user } } = getState() as RootState;
          if (!user || !user.uid) throw new Error("User not found");

          const deletedNoteId = await deleteNote(user.uid, id);
          await dispatch(notesApi.endpoints.setActiveNote.initiate(null));
          return { data: deletedNoteId };
        } catch (error) {
          return { error: (error as Error)?.message || 'An error occurred' };
        }
      },
      invalidatesTags: ['Notes',],
    }),
  })
});

export const invalidateAllTags = () => (dispatch: AppDispatch) => {
  dispatch(notesApi.util.invalidateTags(['Notes', 'ActiveNote']));
};

export const {
  useGetNotesQuery,
  useAddNoteMutation,
  useGetActiveNoteQuery,
  useSetActiveNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} = notesApi;