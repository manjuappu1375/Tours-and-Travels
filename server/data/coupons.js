
const getFutureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

const getPastDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

const coupons = [
  {
    code: 'SUMMER20',
    discountPercentage: 20,
    expiryDate: getFutureDate(60), // Expires in 60 days
    isActive: true,
  },
  {
    code: 'TRAVELX10',
    discountPercentage: 10,
    expiryDate: getFutureDate(30),
    isActive: true,
  },
  {
    code: 'EXPIRED',
    discountPercentage: 50,
    expiryDate: getPastDate(5), // Expired 5 days ago
    isActive: true,
  },
  {
    code: 'INACTIVE15',
    discountPercentage: 15,
    expiryDate: getFutureDate(90),
    isActive: false,
  },
];

export default coupons;
