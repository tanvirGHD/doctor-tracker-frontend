// Turns the API's validation details into { field: message } for the form.
export const fieldErrorsFrom = (error) =>
  (error?.details || []).reduce((acc, item) => {
    if (item.field && !acc[item.field]) acc[item.field] = item.message;
    return acc;
  }, {});

export const PHONE_RE = /^[+\d][\d\s\-()]{5,19}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
