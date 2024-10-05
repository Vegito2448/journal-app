// alerts.ts

import { ReactiveSwal } from "../components";

export const LoadingNoteAlert = (title: string) => ReactiveSwal.fire({
  title: title || 'Saving Note',
  allowOutsideClick: false,
  didOpen: () => {
    ReactiveSwal.showLoading();
  }
});

export const ErrorNoteAlert = (error: Error | string) => ReactiveSwal.fire({
  icon: 'error',
  title: 'Error',
  text: 'An error occurred; Error: ' + (typeof error === 'string' ? error : error?.message || ''),
});