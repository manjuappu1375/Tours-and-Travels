import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@travelx.com',
    password: bcrypt.hashSync('password', 10),
    role: 'admin',
  },
  {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: bcrypt.hashSync('password', 10),
  },
  {
    name: 'Sam Wilson',
    email: 'sam.wilson@example.com',
    password: bcrypt.hashSync('password', 10),
  },
];

export default users;
