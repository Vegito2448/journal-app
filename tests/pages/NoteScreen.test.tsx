import { vi } from 'vitest';
import * as Hooks from '../../src/hooks';
import { useForm } from '../../src/hooks';
import { NoteScreen } from '../../src/pages/NoteScreen';
import * as storeModule from '../../src/store';
import { useDeleteNoteMutation } from '../../src/store';
import { Note } from '../../src/types';
import { renderWithProviders } from "../utils";
// Mock the hooks
const note: Note = {
  id: '1',
  title: 'Test Title',
  body: 'Test Body',
  url: 'http://example.com/image.jpg',
  date: new Date()
};

vi.spyOn(storeModule, 'useDeleteNoteMutation').mockImplementation(vi.fn().mockReturnValue([vi.fn()]));

vi.spyOn(Hooks, 'useForm').mockReturnValue({
  handleChange: vi.fn(),
  resetForm: vi.fn(),
  ...note
});

describe('NoteScreen', () => {

  const { handleChange, resetForm } = useForm({
    initialState: note
  });
  const [mockDeleteNote] = useDeleteNoteMutation();


  test('renders NoteScreen with note data', () => {
    const { getByPlaceholderText, getByAltText } = renderWithProviders({
      customComponent: <NoteScreen {...note} />
    });
    expect(getByPlaceholderText('Some awesome title')).toHaveValue(note.title);
    expect(getByPlaceholderText('What happened today')).toHaveValue(note.body);
    expect(getByAltText('imagen')).toHaveAttribute('src', note.url);
  });

  test('calls handleChange on input change', async () => {
    const { user: userEvent, getByPlaceholderText } = renderWithProviders({
      customComponent: <NoteScreen {...note} />
    });
    await userEvent.type(getByPlaceholderText('Some awesome title'), 'New Title');
    await userEvent.type(getByPlaceholderText('What happened today'), 'New Body');

    expect(handleChange).toHaveBeenCalledTimes(17); // 9 characters in "New Title" + 8 characters in "New Body"
  });

  test('calls deleteNote on delete button click', async () => {
    const { user: userEvent, getByText } = renderWithProviders({
      customComponent: <NoteScreen {...note} />
    });

    await userEvent.click(getByText('Delete'));

    expect(mockDeleteNote).toHaveBeenCalledWith(note.id);
  });

  test('resets form when note id changes', () => {
    const { rerender } = renderWithProviders({
      customComponent: <NoteScreen {...note} />
    });

    const newNote = { ...note, id: '2' };
    rerender(<NoteScreen {...newNote} />);

    expect(resetForm).toHaveBeenCalledWith(newNote);
  });
});