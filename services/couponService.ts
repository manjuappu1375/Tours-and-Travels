import { Coupon } from '../types';
import api from './api';

export const getCoupons = async (): Promise<Coupon[]> => {
  const { data } = await api.get('/coupons');
  return data;
};

interface CreateCouponData {
  code: string;
  discountPercentage: number;
  expiryDate: string;
}

export const createCoupon = async (couponData: CreateCouponData): Promise<Coupon> => {
  const { data } = await api.post('/coupons', couponData);
  return data;
};

interface UpdateCouponData {
  isActive?: boolean;
}

export const updateCoupon = async (id: string, couponData: UpdateCouponData): Promise<Coupon> => {
    const { data } = await api.put(`/coupons/${id}`, couponData);
    return data;
};

export const applyCoupon = async (code: string): Promise<Coupon> => {
    const { data } = await api.post('/coupons/apply', { code });
    return data;
}
