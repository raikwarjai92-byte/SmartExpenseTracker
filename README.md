# Smart Expense Tracker

This is a small web app I made to keep track of my income and expenses. You can add entries, see the balance, and check how much was spent in each category. The data is stored in the browser (local storage) so it doesn't disappear when the page is refreshed.

Made using HTML, CSS and JavaScript.

## What it can do

- Add income and expense with amount, category and date
- Shows total income, total expense and balance
- Category wise summary
- Filter entries by category or type
- Delete an entry

## How to run

Download the project and open `index.html` in any browser.

## Testing

After building the app I tested it manually. I wrote the test cases in a sheet first, then ran them one by one and noted the result. I repeated the important ones again whenever I changed something in the code.

Things I checked:

1. Adding, deleting and filtering entries work properly
2. Balance is calculated correctly (income minus expense)
3. Wrong inputs are not accepted (empty, zero, negative, letters in amount field)
4. Data is still there after refreshing or closing the tab
5. App works in Chrome, Firefox and Edge, and also on mobile screen size

### Test cases

| ID | Scenario | Steps | Expected result | Actual result | Status |
|----|----------|-------|-----------------|---------------|--------|
| TC01 | Add income | Enter 5000, category Salary, click Add | Entry is added, balance becomes 5000 | | |
| TC02 | Add expense | Enter 200, category Food, click Add | Entry is added, balance reduces by 200 | | |
| TC03 | Empty amount | Leave amount blank, click Add | Error message, entry not added | | |
| TC04 | Negative amount | Enter -100, click Add | Should not be accepted | | |
| TC05 | Zero amount | Enter 0, click Add | Should not be accepted | | |
| TC06 | Letters in amount | Type "abc" in amount | Should not be accepted | | |
| TC07 | Decimal amount | Enter 99.99, click Add | Added correctly, balance is correct | | |
| TC08 | Delete entry | Delete the 200 expense | Balance goes back up by 200 | | |
| TC09 | Refresh page | Add 2-3 entries, refresh | Entries are still there | | |
| TC10 | Filter by category | Select Food in filter | Only Food entries are shown | | |
| TC11 | No data | Clear local storage, reload | App opens without error, balance is 0 | | |
| TC12 | Very big amount | Enter 99999999999 | App should not break or show wrong total | | |

(Fill Actual result and Status after running each case - Pass / Fail)

### Bug report

**Bug 1**

- Title: (short one line about the bug)
- Steps to reproduce: (write the steps)
- Expected result: 
- Actual result: 
- Severity: Low / Medium / High
- Status: Fixed / Open

### What I learned

- How to write test cases and think about wrong inputs, not just correct ones
- How to write a proper bug report so someone else can repeat the bug
- Using browser dev tools (Console and Application tab) to check errors and local storage

### To do

- Write automated tests for the balance calculation
- Try Selenium for UI testing
-
