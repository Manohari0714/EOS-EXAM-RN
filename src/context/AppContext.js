import React, { createContext, useContext, useState } from 'react';
import { seedUsers, seedTransactions, DEFAULT_CATEGORIES } from '../utils/seed';
import { formatMoney, sameMonth } from '../utils/helpers';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [users, setUsers] = useState(seedUsers);
  const [transactions, setTransactions] = useState(seedTransactions);
  const [customCategories, setCustomCategories] = useState([]);
  const [budgets, setBudgets] = useState({}); // key: `${userId}:${categoryId}`
  const [notifications, setNotifications] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const userTransactions = currentUser ? transactions.filter((t) => t.userId === currentUser.id) : [];
  const categories = [
    ...DEFAULT_CATEGORIES,
    ...customCategories.filter((c) => currentUser && c.ownerId === currentUser.id),
  ];
  const getCategory = (id) =>
    [...DEFAULT_CATEGORIES, ...customCategories].find((c) => c.id === id) ||
    DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1];

  const myNotifications = currentUser ? notifications.filter((n) => n.userId === currentUser.id) : [];

  // ---------------- Auth ----------------
  const signIn = (email, password, role) => {
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u) return { ok: false, error: 'No account found with this email.' };
    if (u.password !== password) return { ok: false, error: 'Incorrect password.' };
    if (u.role !== role) {
      return {
        ok: false,
        error: `This account is registered as ${u.role === 'admin' ? 'an Admin' : 'a Customer'}. Please choose the correct role.`,
      };
    }
    setCurrentUserId(u.id);
    return { ok: true };
  };

  const signUp = ({ name, email, phone, password, role }) => {
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const user = {
      id: `u-${Date.now()}`,
      role,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      budget: role === 'customer' ? 15000 : 0,
    };
    setUsers((prev) => [...prev, user]);
    return { ok: true };
  };

  const signOut = () => setCurrentUserId(null);

  const updateProfile = (fields) => {
    if (
      fields.email &&
      users.some((u) => u.id !== currentUser.id && u.email.toLowerCase() === fields.email.trim().toLowerCase())
    ) {
      return { ok: false, error: 'This email is already used by another account.' };
    }
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, ...fields } : u)));
    return { ok: true };
  };

  // ---------------- Notifications ----------------
  const addNotification = (userId, message) =>
    setNotifications((prev) => [
      { id: `n-${Date.now()}-${Math.random()}`, userId, message, date: new Date().toISOString(), read: false },
      ...prev,
    ]);

  const markNotificationsRead = () =>
    setNotifications((prev) => prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n)));

  // ---------------- Personalised alert message ----------------
  const buildAlert = (action, tx, list) => {
    const first = currentUser.name.trim().split(/\s+/)[0];
    const verb = { add: 'added', update: 'updated', delete: 'deleted' }[action];
    const cat = getCategory(tx.category);
    let msg = `Hi ${first}, your ${tx.type} "${tx.title}" of ${formatMoney(tx.amount)} (${cat.name}) was ${verb} successfully.`;

    const now = new Date();
    const mine = list.filter((t) => t.userId === currentUser.id && sameMonth(new Date(t.date), now));
    const spent = mine.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const budget = currentUser.budget;
    if (budget > 0) {
      const pct = Math.round((spent / budget) * 100);
      if (spent > budget) {
        msg += `\n\n⚠️ Alert: you have exceeded your monthly budget of ${formatMoney(budget)} by ${formatMoney(spent - budget)}.`;
      } else if (pct >= 80) {
        msg += `\n\n⚠️ Heads up: you have used ${pct}% of your monthly budget.`;
      } else {
        msg += `\n\n✅ You still have ${formatMoney(budget - spent)} left this month (${pct}% used).`;
      }
    }
    const catBudget = budgets[`${currentUser.id}:${tx.category}`];
    if (catBudget > 0 && tx.type === 'expense') {
      const catSpent = mine.filter((t) => t.type === 'expense' && t.category === tx.category).reduce((s, t) => s + t.amount, 0);
      if (catSpent > catBudget) {
        msg += `\n\n⚠️ ${cat.name} spending is over its ${formatMoney(catBudget)} limit.`;
      }
    }
    return msg;
  };

  // ---------------- Transactions ----------------
  const addTransaction = (data) => {
    const tx = { id: `t-${Date.now()}`, userId: currentUser.id, ...data };
    const next = [tx, ...transactions];
    setTransactions(next);
    const message = buildAlert('add', tx, next);
    addNotification(currentUser.id, message);
    return { ok: true, message };
  };

  const updateTransaction = (id, data) => {
    const old = transactions.find((t) => t.id === id);
    const tx = { ...old, ...data };
    const next = transactions.map((t) => (t.id === id ? tx : t));
    setTransactions(next);
    const message = buildAlert('update', tx, next);
    addNotification(currentUser.id, message);
    return { ok: true, message };
  };

  const deleteTransaction = (id) => {
    const tx = transactions.find((t) => t.id === id);
    const next = transactions.filter((t) => t.id !== id);
    setTransactions(next);
    const message = buildAlert('delete', tx, next);
    addNotification(currentUser.id, message);
    return { ok: true, message };
  };

  // ---------------- Categories ----------------
  const addCategory = (name) => {
    const clean = name.trim();
    if (categories.some((c) => c.name.toLowerCase() === clean.toLowerCase())) {
      return { ok: false, error: 'This category already exists.' };
    }
    setCustomCategories((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, name: clean, icon: 'pricetag', ownerId: currentUser.id },
    ]);
    return { ok: true };
  };

  const getCategoryBudget = (categoryId) => (currentUser ? budgets[`${currentUser.id}:${categoryId}`] || 0 : 0);
  const setCategoryBudget = (categoryId, amount) =>
    setBudgets((prev) => ({ ...prev, [`${currentUser.id}:${categoryId}`]: amount }));

  // ---------------- Admin ----------------
  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setTransactions((prev) => prev.filter((t) => t.userId !== id));
  };

  const value = {
    users,
    currentUser,
    transactions,
    userTransactions,
    categories,
    getCategory,
    notifications: myNotifications,
    signIn,
    signUp,
    signOut,
    updateProfile,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    getCategoryBudget,
    setCategoryBudget,
    markNotificationsRead,
    deleteUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
