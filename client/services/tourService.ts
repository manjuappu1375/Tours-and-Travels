import { Tour } from '../types';
import api from './api';

export const getTours = async ({ keyword = '', state = '' } = {}): Promise<Tour[]> => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (state) params.append('state', state);

  const { data } = await api.get(`/tours?${params.toString()}`);
  return data;
};

export const getTourById = async (id: string): Promise<Tour | undefined> => {
  const { data } = await api.get(`/tours/${id}`);
  return data;
};