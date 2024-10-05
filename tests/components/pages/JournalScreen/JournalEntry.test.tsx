import { vi } from 'vitest';
import { JournalEntry } from "../../../../src/components";
import * as storeModule from '../../../../src/store';
import { useSetActiveNoteMutation } from '../../../../src/store';
import { Note } from "../../../../src/types";
import { renderWithProviders } from "../../../utils";

vi.spyOn(storeModule, 'useSetActiveNoteMutation').mockImplementation(vi.fn().mockReturnValue([vi.fn(), { isLoading: false }]));

describe('JournalEntry', () => {

  const [mockSetActiveNote] = useSetActiveNoteMutation();

  const note: Note = {
    id: '1',
    body: 'Test Body',
    title: 'Test Title',
    url: 'http://example.com/image.jpg',
    date: '2023-10-01',
  };


  test('renders JournalEntry with note data', () => {
    const { getByText, container } = renderWithProviders({
      customComponent: <JournalEntry {...note} />
    });

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Body')).toBeInTheDocument();
    expect(getByText('Sunday')).toBeInTheDocument(); // Assuming the date is a Sunday
    expect(getByText('1st')).toBeInTheDocument(); // Assuming the date is the 1st
    const entryPicture = container.querySelector('.journal__entry-picture');
    expect(entryPicture).toHaveStyle(`background-image: url(${note.url})`);
  });

  test('calls setActiveNote on entry click', async () => {
    const { getByText, user: userEvent } = renderWithProviders({
      customComponent: <JournalEntry {...note} />
    });

    await userEvent.click(getByText('Test Title'));

    expect(mockSetActiveNote).toHaveBeenCalledWith(note);
  });

  test('displays loading cursor when isLoading is true', () => {
    vi.mocked(useSetActiveNoteMutation).mockReturnValue([
      mockSetActiveNote,
      { isLoading: true, reset: vi.fn() }
    ]);
    const { container } = renderWithProviders({
      customComponent: <JournalEntry {...note} />
    });

    const entryElement = container.querySelector('.journal__entry');

    expect(entryElement).toHaveClass('wait');
  });
});