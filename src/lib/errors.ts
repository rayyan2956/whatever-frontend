import { ApiError } from "./api";

export interface FormError {
  message: string;
  fields: Record<string, string>;
}

// Turns an API error into a form-level message plus per-field messages.
// `codeFields` puts errors that belong to one field (e.g. CNIC_LOCKED → cnic)
// under that field instead of the top of the form.
export function toFormError(error: unknown, codeFields: Record<string, string> = {}): FormError {
  if (error instanceof ApiError) {
    const fields: Record<string, string> = {};
    for (const [field, messages] of Object.entries(error.details ?? {})) {
      if (Array.isArray(messages) && messages[0]) fields[field] = messages[0];
    }
    const field = codeFields[error.code];
    if (field) fields[field] = error.message;
    return { message: error.message, fields };
  }
  return { message: "Can't reach the server. Check your connection and try again.", fields: {} };
}
