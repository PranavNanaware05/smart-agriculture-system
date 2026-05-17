import type { AxiosError } from 'axios';
import type { ErrorResponse } from '../types';

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  const axiosError = error as AxiosError<ErrorResponse>;
  const data = axiosError.response?.data;

  if (data?.fieldErrors?.length) {
    return data.fieldErrors.map((v) => `${v.field}: ${v.message}`).join(', ');
  }

  if (data?.message) {
    return data.message;
  }

  if (axiosError.message) {
    return axiosError.message;
  }

  return fallback;
}
