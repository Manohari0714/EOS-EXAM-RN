// Every validator returns an error string, or '' when the value is valid.
import { parseDMY, startOfDay } from './helpers';

export const validateName = (v) => {
  const s = (v || '').trim();
  if (!s) return 'Name is required';
  if (s.length < 3) return 'Name must be at least 3 characters';
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(s)) return 'Name can contain only letters and spaces';
  return '';
};

export const validateEmail = (v) => {
  const s = (v || '').trim();
  if (!s) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return 'Enter a valid email address';
  return '';
};

export const validatePhone = (v) => {
  const s = (v || '').trim();
  if (!s) return 'Mobile number is required';
  if (!/^[6-9]\d{9}$/.test(s)) return 'Enter a valid 10-digit mobile number';
  return '';
};

export const validatePassword = (v) => {
  if (!v) return 'Password is required';
  if (v.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Password must contain a letter and a number';
  return '';
};

export const validateConfirm = (p, c) => {
  if (!c) return 'Please confirm your password';
  if (p !== c) return 'Passwords do not match';
  return '';
};

export const validateTitle = (v) => {
  const s = (v || '').trim();
  if (!s) return 'Title is required';
  if (s.length < 2) return 'Title must be at least 2 characters';
  if (s.length > 40) return 'Title must be 40 characters or fewer';
  return '';
};

export const validateAmount = (v) => {
  const s = String(v || '').trim();
  if (!s) return 'Amount is required';
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return 'Enter a valid amount (numbers only)';
  const n = parseFloat(s);
  if (n <= 0) return 'Amount must be greater than 0';
  if (n > 10000000) return 'Amount is too large';
  return '';
};

export const validateDate = (v) => {
  const dt = parseDMY(v);
  if (!dt) return 'Use the format DD-MM-YYYY';
  if (dt > startOfDay(new Date())) return 'Date cannot be in the future';
  return '';
};

export const validateCategoryName = (v) => {
  const s = (v || '').trim();
  if (!s) return 'Category name is required';
  if (s.length < 2) return 'Name must be at least 2 characters';
  if (s.length > 15) return 'Name must be 15 characters or fewer';
  return '';
};
