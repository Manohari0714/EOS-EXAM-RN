// Demo data only. The exam says no back end / database is needed, so everything lives in memory.

export const ADMIN_CODE = 'ADMIN2026'; // needed to register a new Admin account

export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'restaurant' },
  { id: 'transport', name: 'Transport', icon: 'bus' },
  { id: 'rent', name: 'Rent', icon: 'home' },
  { id: 'medicine', name: 'Medicine', icon: 'medkit' },
  { id: 'groceries', name: 'Groceries', icon: 'cart' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film' },
  { id: 'gifts', name: 'Gifts', icon: 'gift' },
  { id: 'savings', name: 'Savings', icon: 'wallet' },
  { id: 'salary', name: 'Salary', icon: 'cash' },
  { id: 'others', name: 'Others', icon: 'ellipsis-horizontal' },
];

export const seedUsers = [
  {
    id: 'admin-1',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@finance.com',
    phone: '9000000000',
    password: 'Admin@123',
    budget: 0,
  },
  {
    id: 'u-demo',
    role: 'customer',
    name: 'Demo Customer',
    email: 'demo@finance.com',
    phone: '9876543210',
    password: 'Demo@123',
    budget: 20000,
  },
  {
    id: 'u-arun',
    role: 'customer',
    name: 'Arun Kumar',
    email: 'arun@finance.com',
    phone: '9123456780',
    password: 'Arun@123',
    budget: 15000,
  },
];

const at = (daysAgo, hour) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

let n = 0;
const make = (userId, rows) =>
  rows.map(([daysAgo, hour, title, amount, type, category]) => ({
    id: `seed-${userId}-${n++}`,
    userId,
    title,
    amount,
    type,
    category,
    date: at(daysAgo, hour),
  }));

export const seedTransactions = [
  ...make('u-demo', [
    [0, 8, 'Breakfast', 180, 'expense', 'food'],
    [0, 13, 'Lunch with team', 450, 'expense', 'food'],
    [0, 7, 'Freelance payment', 3500, 'income', 'salary'],
    [1, 9, 'Bus pass', 600, 'expense', 'transport'],
    [1, 18, 'Vegetables', 720, 'expense', 'groceries'],
    [2, 10, 'Monthly Salary', 40000, 'income', 'salary'],
    [2, 20, 'Movie night', 500, 'expense', 'entertainment'],
    [3, 11, 'Pharmacy', 380, 'expense', 'medicine'],
    [4, 12, 'Groceries', 1650, 'expense', 'groceries'],
    [5, 9, 'Birthday gift', 1200, 'expense', 'gifts'],
    [6, 17, 'Auto fare', 220, 'expense', 'transport'],
    [7, 10, 'Rent', 8000, 'expense', 'rent'],
    [9, 14, 'Dinner', 900, 'expense', 'food'],
    [11, 10, 'Savings deposit', 2000, 'expense', 'savings'],
    [14, 16, 'Doctor visit', 700, 'expense', 'medicine'],
    [18, 10, 'Part-time income', 5000, 'income', 'salary'],
    [21, 19, 'Concert tickets', 1500, 'expense', 'entertainment'],
    [28, 10, 'Monthly Salary', 40000, 'income', 'salary'],
    [31, 10, 'Rent', 8000, 'expense', 'rent'],
    [35, 13, 'Groceries', 2100, 'expense', 'groceries'],
    [40, 9, 'Fuel', 1800, 'expense', 'transport'],
    [50, 12, 'Gift for friend', 900, 'expense', 'gifts'],
  ]),
  ...make('u-arun', [
    [0, 9, 'Tea and snacks', 120, 'expense', 'food'],
    [1, 10, 'Salary', 28000, 'income', 'salary'],
    [2, 12, 'Groceries', 1400, 'expense', 'groceries'],
    [4, 15, 'Medicine', 450, 'expense', 'medicine'],
    [6, 10, 'Rent', 6500, 'expense', 'rent'],
    [10, 18, 'Movie', 400, 'expense', 'entertainment'],
    [20, 11, 'Bus pass', 500, 'expense', 'transport'],
  ]),
];
