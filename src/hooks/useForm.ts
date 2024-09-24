import { ChangeEvent, useState } from 'react';

type Props<T> = {
  initialState: T;
};

export function useForm<T>({ initialState }: Props<T>) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  const resetForm = (newFormState = initialState) => setFormData(newFormState);


  return ({
    // Properties
    ...formData,


    // Methods
    handleChange,
    resetForm
  });
}