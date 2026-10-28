# Finance Budget Tracker – React Native (Expo)

RVS College of Arts and Science (Autonomous) · School of Computer Studies · MCA 2025 Batch · Semester III
Core Elective: Mobile App Development using React Native · EoS Examination, 28-10-2026 · 75 Marks

A mobile finance / budget tracker with two kinds of users – **Admin** and **Customer** – following the
green "Finance Budget Tracker" Figma design. There is **no back end and no database**: all data is kept in memory
(React Context) and is reset when the app is reloaded.

---

## How to run

You need Node.js (LTS) and the **Expo Go** app on your phone (or an Android emulator).

```bash
npm install
npx expo install --fix      # aligns every package to the Expo SDK version (important!)
npx expo start
```

Scan the QR code with Expo Go. Press `w` to open it in a browser instead.

### If `npm install` or Expo Go complains about versions

Create a fresh Expo project and drop this code into it (this always works):

```bash
npx create-expo-app@latest finance-budget-tracker --template blank
cd finance-budget-tracker
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated @expo/vector-icons
```

Then copy the `src` folder, `App.js`, `index.js` (and `babel.config.js` if you don't have one) from this project into it
(replace the existing `App.js`) and run `npx expo start`.

---

## Demo logins

| Role     | Email                | Password   |
|----------|----------------------|------------|
| Customer | demo@finance.com     | Demo@123   |
| Customer | arun@finance.com     | Arun@123   |
| Admin    | admin@finance.com    | Admin@123  |

New accounts can be created with **Sign Up**. To register a new **Admin**, choose "Admin" and enter the access code `ADMIN2026`.
The Sign In screen also has a "Fill demo credentials" shortcut.

---

## Rubric coverage (75 marks)

### Part I – React Native Screens (30)

| # | Screen (marks) | File |
|---|----------------|------|
| 1 | Home Screen with Sign Up & Sign In – Admin and Customers (5) | `src/screens/HomeScreen.js`, `LoginScreen.js`, `SignUpScreen.js` |
| 2 | Analysis Screen – Admin and Customers (5) | `src/screens/AnalysisScreen.js` (Admin sees all customers combined) |
| 3 | Profile and Edit Profile – Customer (5) | `src/screens/ProfileScreen.js`, `EditProfileScreen.js` |
| 4 | Transaction (month wise) – Customer (5) | `src/screens/TransactionsScreen.js` (+ `AddTransactionScreen.js`) |
| 5 | Overall Categories – Customer (5) | `src/screens/CategoriesScreen.js` |
| 6 | Category Details – Customer (5) | `src/screens/CategoryDetailsScreen.js` |

### Part II – React Navigation (30) – all three are used

| Navigator (marks) | Where |
|-------------------|-------|
| Stack Navigation (10) | `src/navigation/index.js` – Home → SignIn/SignUp, and AddTransaction / CategoryDetails / EditProfile pushed on top of the app |
| Tabs Navigation (10) | `src/navigation/CustomerTabs.js` – Home, Analysis, Transactions, Categories, Profile |
| Drawer Navigation (10) | `src/navigation/CustomerDrawer.js`, `AdminDrawer.js`, `DrawerContent.js` – menu icon in every header |

### Part III – Functional Requirements (15)

| Requirement (marks) | How it is done |
|---------------------|----------------|
| (i) All users can navigate each screen (5) | Customer: bottom tabs + drawer + buttons. Admin: drawer (Dashboard, Analysis). Back buttons everywhere. |
| (ii) Personalised alert on any change in transactions (5) | Adding, editing or deleting a transaction shows an alert such as *"Hi Demo, your expense "Lunch" of ₹450 (Food) was added successfully. ✅ You still have ₹X left this month"* – or a ⚠️ warning when the monthly or category budget is near/over. The same message is stored in the 🔔 bell on the Home screen. (`src/context/AppContext.js` → `buildAlert`) |
| (iii) Daily / Weekly / Monthly reports on the home screen (5) | `DashboardScreen.js` – segmented Daily / Weekly / Monthly with income, expense, bar chart and recent transactions |

### Important notes

1. **Match ≥ 75 % with Figma** – same green/mint colour palette, header + rounded panel layout, balance card with budget
   progress bar, bottom tab bar, category grid, income/expense colours.
2. **Basic validation on every screen** – see `src/utils/validators.js` (name, email, 10-digit mobile, password rules,
   confirm password, amount > 0, title, DD-MM-YYYY date not in the future, category name, budget).
3. **No back end / database** – everything is in `src/context/AppContext.js` with demo data in `src/utils/seed.js`.

---

## Project structure

```
App.js                     providers + root navigator
src/
  context/AppContext.js    users, transactions, categories, notifications, personalised alerts
  navigation/              Stack, Tabs, Drawer
  screens/                 all screens
  components/              ScreenLayout, InputField, BarChart, TransactionItem, ...
  utils/                   helpers (reports/dates), validators, seed data, dialogs
  theme.js                 colours + currency symbol
```

Tip: change the currency symbol in `src/theme.js` (`CURRENCY`).
