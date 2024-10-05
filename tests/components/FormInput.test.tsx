import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';
import { FormInput } from "../../src/components";


const renderWithFormik = (ui: React.ReactElement) => {
  return render(
    <Formik
      initialValues={{ testInput: '', testCheckbox: false, testSelect: '' }}
      onSubmit={vi.fn()}
      validate={(values) => {
        const errors: { testInput?: string; } = {};
        if (!values.testInput) {
          errors.testInput = 'This field is required';
        }
        return errors;
      }}
    >
      <Form>
        {ui}
      </Form>
    </Formik>
  );
};

describe('FormInput', () => {
  test('renders text input', () => {
    renderWithFormik(<FormInput type="text" name="testInput" label="Test Input" />);
    expect(screen.getByText(/test input/i)).toBeInTheDocument();
  });

  test('renders checkbox input', () => {
    renderWithFormik(<FormInput type="checkbox" name="testCheckbox" label="Test Checkbox" />);
    expect(screen.getByLabelText(/test checkbox/i)).toBeInTheDocument();
  });

  test('renders select input', () => {
    renderWithFormik(
      <FormInput type="select" name="testSelect" label="Test Select" options={[{ value: 'option1', label: 'Option 1' }]} />
    );
    expect(screen.getByText(/test select/i)).toBeInTheDocument();
  });

  test('allows user to input text', async () => {
    renderWithFormik(<FormInput type="text" name="testInput" label="Test Input" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  test('allows user to check checkbox', async () => {
    renderWithFormik(<FormInput type="checkbox" name="testCheckbox" label="Test Checkbox" />);
    const checkbox = screen.getByLabelText(/test checkbox/i);
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('allows user to select option', async () => {
    renderWithFormik(
      <FormInput type="select" name="testSelect" label="Test Select" options={[{ value: 'option1', children: 'Option 1' }]} />
    );
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'option1');
    expect(select).toHaveValue('option1');
  });

  test('displays error message', async () => {
    renderWithFormik(
      <FormInput type="text" name="testInput" label="Test Input" ErrorMessageFP={{
        className: 'has-error',
        name: 'testInput',
        children: () => <p>this field is required</p>
      }} />
    );
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Hello World');
    await userEvent.clear(input);
    await userEvent.tab();
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });
});