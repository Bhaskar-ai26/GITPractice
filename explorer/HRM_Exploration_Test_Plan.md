# HRM Application: Exploration and Test Plan

**Application:** OrangeHRM 5.9 (VibeTestQ HRM demo)
**URL:** https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/
**Login page:** `/web/auth/login` (Username, Password, Login button, "Forgot your password?" link)
**Exploration method:** Playwright CLI, named session `hrm`, accessibility snapshots

---

## 1. Functional Map

The main sidebar exposes 11 modules. The top bar shows the current module and sub-page.

| # | Module | Route | Observed content | Sub-pages / tabs seen |
|---|--------|-------|------------------|------------------------|
| 1 | Dashboard | `/web/dashboard/index` | Time at Work widget (punch in/out, today's hours, weekly hours), My Actions, Quick Launch (Timesheets, My Timesheet), Buzz Latest Posts, Employees on Leave Today, Employee Distribution by Sub Unit and by Location | None |
| 2 | Admin | `/web/admin/viewAdminModule` | System Users table (Username, User Role, Employee Name, Status, Actions) with filters and Reset/Search | Job, Organization, Qualifications, Nationalities, Corporate Branding, Configuration |
| 3 | PIM | `/web/pim/viewPimModule` | Employee Information search (Employee Name, Employee Id, filters) and results table (Id, First/Middle Name, Last Name, Job Title, Employment Status, Sub Unit, Supervisor) | Add Employee (`/pim/addEmployee`), Configuration, Reports |
| 4 | Leave | `/web/leave/viewLeaveModule` | Configure section with Reset and Save | Leave entitlements, applications, reports, and configuration (not fully explored) |
| 5 | Time | `/web/time/viewTimeModule` | Select Employee (View), Timesheets Pending Action table (Employee Name, Timesheet Period, Actions) | Attendance, Reports, Project info (not fully explored) |
| 6 | Recruitment | `/web/recruitment/viewRecruitmentModule` | Candidates search and table (Vacancy, Candidate, Hiring Manager, Date of Application, Status, Actions) | Vacancies, Candidates (not fully explored) |
| 7 | My Info | `/web/pim/viewMyDetails` | Logged-in employee's personal details (name, Save), Attachments table (File Name, Description, Size, Type, Date Added, Added By, Actions) | Contact details, Emergency contacts, Dependents, Immigration, Job, Salary, Report-to, Qualifications, Memberships (not fully explored) |
| 8 | Performance | `/web/performance/viewPerformanceModule` | Employee Reviews table (Employee, Job Title, Sub Unit, Review Period, Due Date, Review Status, Actions) with Reset/Search | Manage Reviews, My Reviews, Configure (not fully explored) |
| 9 | Directory | `/web/directory/viewDirectory` | Directory search (employee name and filters) with Reset/Search | None |
| 10 | Maintenance | `/web/maintenance/viewMaintenanceModule` | "Administrator Access" confirmation page requiring the admin password, with Cancel and Confirm | Purge employee records (not explored) |
| 11 | Claim | `/web/claim/viewClaimModule` | Employee Claims table (Reference Id, Employee Name, Event Name, Description, Currency, Submitted Date, Status, Amount, Actions) with Reset/Search | Submit Claim, Configuration (not fully explored) |
| 12 | Buzz | `/web/buzz/viewBuzz` | Social feed with Post, Share Photos, and Share Video buttons | None |

### 1.1 Key screen details

- **Add Employee** (`/web/index.php/pim/addEmployee`): photo upload ("Choose File"), First Name, Middle Name, Last Name, Employee Id, "Create Login Details" checkbox, Cancel and Save.
- **My Info** (`/web/index.php/pim/viewPersonalDetails/empNumber/<n>`): the page heading is "PIM", not "My Info". The breadcrumb also shows "PIM".
- **Admin > System Users**: user role and status filters, plus Reset and Search.
- **Login**: the username and password fields are required, and the page uses a "Forgot your password?" link.

---

## 2. Test Strategy

- **Scope:** Functional UI testing of the 12 modules above, role-based access, form validation, search and filter behavior, navigation, and session handling.
- **Priorities:**
  - **P1:** Login and logout, navigation to each module, add/search/edit employee, system user management, leave application, timesheet, and recruitment candidate flow.
  - **P2:** Filters, pagination, sorting, validation messages, and the My Info sub-tabs.
  - **P3:** Buzz posts, Directory search, reports, and cosmetic checks.
- **Test data:** use dedicated test accounts and employees. Do not run destructive modules such as Maintenance > Purge on shared data.
- **Automation fit:** the existing Cucumber suite in `bdd/` already covers login and the sidebar menu links (`bdd/features/alllinks.feature`). The plan below extends that coverage.

---

## 3. Suggested Test Scenarios

> The "Expected result" columns are proposed outcomes based on standard OrangeHRM behavior. They were not all verified during exploration. Confirm each one against the app before automating it.

### 3.1 Authentication (P1)

| ID | Scenario | Steps | Expected result |
|----|----------|-------|-----------------|
| AUTH-01 | Valid login | Enter a valid username and password, click Login | Dashboard loads, user name shown in top bar |
| AUTH-02 | Invalid password | Valid username, wrong password | Invalid credentials message, stays on login |
| AUTH-03 | Empty fields | Click Login with both fields empty | Required-field messages, no request sent |
| AUTH-04 | Case-sensitive password | Correct password with different casing | Login rejected |
| AUTH-05 | Logout | Open the user menu, click Logout | Returns to login page, dashboard URL is blocked |
| AUTH-06 | Direct URL access when logged out | Open `/web/index.php/pim/viewPimModule` in a new session | Redirected to login |
| AUTH-07 | Forgot password link | Click "Forgot your password?" | Reset password form appears |

### 3.2 Navigation (P1)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| NAV-01 | Each sidebar link opens its module | URL and heading match the module (My Info shows heading "PIM") |
| NAV-02 | Sidebar search filters the menu | Matching items remain, others hide |
| NAV-03 | Browser back and forward | Module state preserved |
| NAV-04 | Dashboard widgets render | Each widget shows a title and content or "No Content" |

### 3.3 PIM: Employee management (P1)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| PIM-01 | Add employee with first and last name | Employee saved, personal details page opens |
| PIM-02 | Add employee with the required name fields empty | Required-field validation, no record saved |
| PIM-03 | Add employee with "Create Login Details" checked | Username and password fields appear and are validated |
| PIM-04 | Search by employee name | Results table shows matching employees |
| PIM-05 | Search by Employee Id | Single matching row |
| PIM-06 | Search with no match | "No Records Found" |
| PIM-07 | Reset search filters | Filters clear, default list shown |
| PIM-08 | Delete an employee | Confirmation dialog, then row removed |
| PIM-09 | Table sorting and pagination | Records sort and page correctly |
| PIM-10 | Photo upload with an unsupported file type | Error message, file rejected |

### 3.4 My Info (P2)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| MYI-01 | Edit personal details and save | Success toast, values persist after reload |
| MYI-02 | Save with a required field empty | Validation message |
| MYI-03 | Attachments: upload a file | File appears in the table with name, size, type, date, and added by |
| MYI-04 | Attachments: delete a file | Row removed after confirmation |
| MYI-05 | Sub-tabs (contact, emergency, dependents, job, salary) | Each tab loads without errors |

### 3.5 Admin: System users and configuration (P1)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| ADM-01 | Search System Users by username | Matching users only |
| ADM-02 | Filter by User Role (Admin, ESS) and Status | Results match filters |
| ADM-03 | Add system user with a new employee name | User created, row appears in table |
| ADM-04 | Add system user with a duplicate username | Duplicate error message |
| ADM-05 | Edit a user's role and status | Changes persist |
| ADM-06 | Delete a system user | Confirmation, then row removed |
| ADM-07 | Job titles, employment statuses, and sub units (Organization tabs) | Add, edit, and delete work and show validation |
| ADM-08 | Corporate branding upload and colour change | Changes apply across the app |

### 3.6 Leave (P1)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| LVE-01 | Apply for leave with valid dates | Request submitted as Pending Approval |
| LVE-02 | Apply where the end date is before the start date | Validation error |
| LVE-03 | Apply for more days than the entitlement | Balance error or warning |
| LVE-04 | Approve or reject a pending leave | Status changes, leave balance updates |
| LVE-05 | Cancel a pending leave | Status changes to Cancelled |
| LVE-06 | Leave list filtered by date range and status | Matching rows only |
| LVE-07 | Configure leave types and entitlements | Changes save and show in the apply form |

### 3.7 Time and Timesheets (P1)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| TIM-01 | Punch in and punch out from the dashboard | Time at Work updates to the new hours |
| TIM-02 | Punch out without punching in | Error or disabled action |
| TIM-03 | Timesheet pending action: approve | Row removed, status approved |
| TIM-04 | Timesheet pending action: reject with a comment | Status rejected, comment saved |
| TIM-05 | My Timesheet: enter hours and save | Totals recalculate |
| TIM-06 | Select Employee and View for a period | Timesheet period loads |

### 3.8 Recruitment (P2)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| REC-01 | Search candidates by name | Matching candidates only |
| REC-02 | Filter by vacancy and status | Results match filters |
| REC-03 | Add a candidate | Candidate created, appears with status Application Initiated |
| REC-04 | Change candidate status (shortlist, interview, reject) | Status changes, history recorded |
| REC-05 | Add candidate with invalid email | Validation message |

### 3.9 Performance (P2)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| PER-01 | Search employee reviews by name and review period | Matching reviews only |
| PER-02 | Open a review and submit employee and supervisor ratings | Ratings save, status updates |
| PER-03 | Review status filter | Results match status |

### 3.10 Claim (P2)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| CLM-01 | Submit a claim with an event and amount | Claim created as Initiated |
| CLM-02 | Submit a claim with a negative amount | Validation message |
| CLM-03 | Approve or reject a claim | Status changes |
| CLM-04 | Search claims by reference Id and status | Matching rows |

### 3.11 Directory, Buzz, and Maintenance (P3)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| DIR-01 | Search Directory by employee name | Matching employees with cards |
| DIR-02 | Filter Directory by job title and location | Results match filters |
| BUZ-01 | Post a text message in Buzz | Post appears at the top of the feed |
| BUZ-02 | Post an empty message | Post is blocked |
| BUZ-03 | Like and comment on a post | Counts update |
| MNT-01 | Maintenance requires the admin password | Wrong password rejected, Cancel returns to the previous page |
| MNT-02 | Maintenance page is restricted to admin users | Non-admin users cannot reach it |

### 3.12 Cross-cutting and non-functional (P2)

| ID | Scenario | Expected result |
|----|----------|-----------------|
| X-01 | Role-based access: ESS user cannot open Admin | Access denied or menu hidden |
| X-02 | Session timeout after inactivity | Redirect to login |
| X-03 | Responsive layout at tablet and mobile widths | Sidebar collapses, tables scroll |
| X-04 | Console errors on each module | No JavaScript errors |
| X-05 | Page load time of the dashboard and employee list | Under 3 seconds on a normal connection |
| X-06 | Keyboard navigation through the login form | Tab order is logical, Enter submits |

---

## 4. Automation Recommendations

1. **Extend `bdd/features/`:** add feature files for AUTH, NAV, PIM, and ADM with P1 scenarios first. Reuse `login.steps.ts` for the Given steps.
2. **Use stable locators:** prefer `getByRole` and `getByLabel`. The app's table headers include trailing spaces (for example `"Username "`), so match with regex or trim.
3. **Use data isolation:** create employees with a unique suffix per run and delete them in an `After` hook.
4. **Keep destructive flows out of the default run:** tag Maintenance and delete scenarios with `@destructive` and exclude them by default.
5. **Set step timeouts** as in `bdd/steps/alllinks.steps.ts` (`STEP_TIMEOUT`), because the app can be slow on first load.

---

## 5. Open Questions

- Which role and permissions are needed for the ESS and Supervisor paths? The exploration used an Admin-level account.
- Is a sandbox or reset process available for destructive tests (add, delete, purge)?
- Should Leave, Time, Recruitment, Performance, and Claim sub-pages be explored in depth before the test cases are written? They are listed here at the module level only.
