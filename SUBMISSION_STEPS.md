# Exam submission checklist (do these in order)

1. **Run the app** (see README.md) and log in with the demo accounts.
2. **Take screenshots** of every screen listed in `Screenshots_Template.docx` (Customer and Admin).
   Make sure the examiner can see: the personalised alert popup, the Daily / Weekly / Monthly reports,
   the Drawer open, the bottom Tabs, and one validation error.
3. **Paste the screenshots** into `Screenshots_Template.docx`, fill in your name and register number
   (as written on your assessment sheet), and add the GitHub link.
4. **Push to a PUBLIC GitHub repo**:

   ```bash
   git init
   git add .
   git commit -m "Finance Budget Tracker - React Native EoS exam"
   git branch -M main
   git remote add origin https://github.com/<your-username>/finance-budget-tracker.git
   git push -u origin main
   ```

   (Create the empty public repository on github.com first. Do not commit `node_modules` - the
   included `.gitignore` already skips it.)
5. **Open the repo link in a private/incognito window** to confirm it is public.
6. **Upload the Word document** (with the GitHub link and screenshots) on the Google Classroom
   "model exam" link before the time is over.

## Last-minute test list (2 minutes)

- [ ] Sign Up with a bad email -> error shows; with valid data -> account created -> Sign In works
- [ ] Customer login -> Home shows Daily / Weekly / Monthly report
- [ ] Add a transaction -> personalised alert popup appears; bell icon shows it
- [ ] Edit and delete a transaction -> alert appears again
- [ ] Transactions screen: change month with the arrows
- [ ] Categories -> tap a category -> Category Details -> set a limit
- [ ] Profile -> Edit Profile -> save with valid data
- [ ] Open the Drawer -> every item works -> Log Out
- [ ] Admin login -> Dashboard + Analysis from the drawer
