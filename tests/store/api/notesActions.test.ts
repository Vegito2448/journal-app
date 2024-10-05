// notesActions.test.ts
import { addDoc, deleteDoc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, QuerySnapshot, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { describe, expect, it, vi } from 'vitest';
import { createNote, deleteNote, fetchActiveNote, fetchNotes, setActiveNote, updateNote } from "../../../src/store";

// Crear mocks de las funciones de Firestore
vi.mock(import('firebase/firestore'), async (originImport) => {
  const actual = await originImport();
  return ({
    ...actual,
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(),
  });
});
globalThis.scrollTo = vi.fn();
describe('notesActions', () => {
  const userUid = 'kpT4TVValPNnBueCfsQ1ZV9ZFZi2';

  it('fetchNotes should return notes', async () => {
    const date = new Date();

    const mockNotes = [
      { id: '1', title: 'Note 1', body: 'Body 1', date: Timestamp.fromDate(date) },
      { id: '2', title: 'Note 2', body: 'Body 2', date: Timestamp.fromDate(date) },
    ];
    const mockNotesReturn = [
      { id: '1', title: 'Note 1', body: 'Body 1', date: date.toISOString() },
      { id: '2', title: 'Note 2', body: 'Body 2', date: date.toISOString() },
    ];

    vi.mocked(getDocs).mockResolvedValue({
      docs: mockNotes.map(note => ({
        id: note.id,
        data: () => note,
      })),
    } as unknown as QuerySnapshot<DocumentData>);

    const notes = await fetchNotes(userUid);
    expect(notes).toEqual(mockNotesReturn);
  });

  it('fetchActiveNote should return active note', async () => {
    const date = new Date();
    const mockNote = { id: '1', title: 'Note 1', body: 'Body 1', date: Timestamp.fromDate(date) };
    const mockNoteReturn = { id: '1', title: 'Note 1', body: 'Body 1', date: date.toISOString() };

    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({ active: mockNote }),
    } as unknown as DocumentSnapshot<unknown, DocumentData>);

    const note = await fetchActiveNote(userUid);
    expect(note).toEqual(mockNoteReturn);
  });

  it('createNote should create and return a new note', async () => {
    const date = new Date();
    const mockNote = { id: '1', title: 'New Note', body: 'New Note Body', date: date.toISOString(), url: "" };

    vi.mocked(addDoc).mockResolvedValue({ id: '1' } as DocumentReference<unknown, DocumentData>);
    vi.mocked(setDoc).mockResolvedValue(mockNote as unknown as void);

    const note = await createNote(userUid);
    expect(note).toHaveProperty('id');
    expect(note).toHaveProperty('title', 'New Note');
    expect(note).toHaveProperty('body', 'New Note Body');
    expect(note).toHaveProperty('date');
    expect(note).toHaveProperty('url', '');
  });

  it('setActiveNote should set and return the active note', async () => {
    const mockNote = { id: '1', title: 'Note 1', body: 'Body 1', date: new Date().toISOString() };

    vi.mocked(setDoc).mockResolvedValue(null as unknown as void);

    const note = await setActiveNote(userUid, mockNote);
    expect(note).toEqual(mockNote);
  });

  it('updateNote should update and return the note', async () => {
    const mockNote = { id: '1', title: 'Updated Note', body: 'Updated Body', date: new Date().toISOString() };

    vi.mocked(updateDoc).mockResolvedValue(null as unknown as void);
    vi.mocked(setDoc).mockResolvedValue(null as unknown as void);

    const note = await updateNote(userUid, mockNote);
    expect(note).toEqual(mockNote);
  });

  it('deleteNote should delete and return the note id', async () => {
    const noteId = '1';

    vi.mocked(deleteDoc).mockResolvedValue(null as unknown as void);
    vi.mocked(setDoc).mockResolvedValue(null as unknown as void);

    const deletedNoteId = await deleteNote(userUid, noteId);
    expect(deletedNoteId).toEqual(noteId);
  });
});