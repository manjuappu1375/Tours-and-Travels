import { User } from '../types';
import api from './api';

/**
 * Fetches all users from the backend.
 * This is an admin-only operation.
 */
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  return data;
};
