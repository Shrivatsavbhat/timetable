# 📋 Project Task Tracker — Reschedule

> **Git Commit Tracking Rule**:
> All tasks and subtasks are marked with **`0`** (Pending / In-Progress) initially.  
> Whenever you complete a subtask or task, change **`0`** to **`1`**, commit the change to Git, and push!
>
> - `[0]` = Not Started / In Progress
> - `[1]` = Completed & Verified

---

## 📊 Overall Team Progress Summary

| Team Member | Assigned Modules / Pages | Status | Completed / Total |
| :--- | :--- | :---: | :---: |
| **Srijan** | Central Dashboard & Notice Management | `COMPLETED` | 12 / 12 |
| **Prajwal** | Student Timetable & Notices Feed | `IN PROGRESS` | 6 / 10 |
| **Royston** | Master Timetable Blueprint & Profile | `IN PROGRESS` | 0 / 10 |
| **Shrivatsa** | Daily Overrides & Notification Center | `IN PROGRESS` | 0 / 10 |
| **Shared / Open** | CR Admin Authentication & Route Guards | `OPEN` | 0 / 4 |

> [!NOTE]
> **Key Architecture Directives**:
> 1. **Login is ONLY for the Class Representative (CR)**: Students and general visitors browse the live dashboard, timetable grid, notices, and notifications with **zero friction (no login required)**.
> 2. **Two Timetable Layers (Both Managed by CR)**:
>    - **Permanent Master Timetable (`admin-master-timetable.html` by Royston)**: The constant semester-wide template (Monday–Saturday). Updated only when permanent changes occur (e.g., permanent faculty reassignment).
>    - **Daily / Weekly Overrides (`admin-override-timetable.html` by Shrivatsa)**: Temporary daily adjustments (cancelled lectures, room swaps, substitute professors) for a specific date or week.
> 3. **Faculty Portal**: Dedicated faculty self-service logins and teacher approvals are planned as a **Future Implementation**.

---

## 👤 Srijan — Central Portal & Notice Management

### 1. Landing Page & Live Dashboard (`public/index.html` & `public/dashboard.html`)
- [1] **1.1** Base layout structure with navigation bar, logo branding, and footer
- [1] **1.2** Landing Page Hero layout with bold typography, tagline, and call-to-action button
- [1] **1.3** Core Features showcase section (Real-Time Updates, Smart Room Finder, Official Notices)
- [1] **1.4** Real-time "Happening Now" lecture status banner with live countdown timer
- [1] **1.5** "Today's Agenda" view dynamically merging master schedule with active overrides
- [1] **1.6** Responsive flexbox styling and mobile breakpoints in `public/css/style.css`

### 2. Notice Management Portal (`public/admin-add-notice.html`)
- [1] **2.1** Notice creation form (Title, Priority/Category dropdown, Date picker, Content textarea)
- [1] **2.2** Priority badge selector (`Urgent`, `High`, `Schedule Shift`, `General`)
- [1] **2.3** Form submit handler connecting to `POST /api/notices`
- [1] **2.4** Admin notice management data table displaying all published notices (`GET /api/notices`)
- [1] **2.5** Status indicator badges on published notices
- [1] **2.6** Edit and Delete controls (`DELETE /api/notices/:id` & `PUT /api/notices/:id`)

---

## 👤 Prajwal — Student Schedule View & Announcements

### 3. Interactive Student Timetable Grid (`public/timetable.html`)
- [1] **3.1** Dual-mode top toggle bar: `[ 🗓️ Current Week's Schedule ]` vs `[ 📌 Permanent Master Grid ]`
- [1] **3.2** Department and Semester dropdown filter controls
- [1] **3.3** Monday–Saturday day tabs / column layout
- [1] **3.4** Color-coded lecture period cards (Subject, Faculty, Time, Room)
- [1] **3.5** Visual alert chips on cards highlighting `RESCHEDULED`, `CANCELLED`, or `SUBSTITUTE`
- [1] **3.6** Connect frontend fetch to `GET /api/agenda`

### 4. Campus Notices Feed (`public/notices.html`)
- [0] **4.1** Filterable notice board feed by categories (`All`, `Urgent`, `Schedule Shift`, `General`)
- [0] **4.2** Real-time instant search bar for keyword filtering (Subject, Room, Faculty)
- [0] **4.3** Notice preview cards with priority color tags and publication dates
- [0] **4.4** Pop-up modal dialog for full text review and announcement memos

---

## 👤 Royston — Academic Master Setup & User Settings

### 5. Permanent Master Timetable Blueprint (`public/admin-master-timetable.html`)
> *Constant semester-long baseline template. Updated by CR only for permanent structural or faculty changes.*
- [0] **5.1** Administrative recurring weekly grid setup (Monday through Saturday constant template)
- [0] **5.2** Slot configuration inputs: Course Code, Subject Title, Default Faculty, Room/Lab
- [0] **5.3** Slot-level Add / Edit / Remove UI controls
- [0] **5.4** Connect blueprint saving to `POST /api/master`
- [0] **5.5** Master schedule table viewer with semester/department switchers

### 6. User Profile & Preferences (`public/profile.html`)
- [0] **6.1** User credential overview (Name, Student ID / Faculty ID, Email)
- [0] **6.2** Role display badge (`Student` vs `Class Representative [CR]`)
- [0] **6.3** Batch and semester selection dropdown saved to user state
- [0] **6.4** Dark / Light mode UI theme toggle with `localStorage` persistence
- [0] **6.5** User alert notification preferences (Email/In-app toggle)

---

## 👤 Shrivatsa — Daily Overrides & Live Alert Feed

### 7. Daily / Weekly Override Manager (`public/admin-override-timetable.html`)
> *Temporary date-specific adjustments & weekly schedule shifts published by the CR.*
- [0] **7.1** Role-check restriction (Restricted to Class Representative [CR])
- [0] **7.2** Calendar date-picker to select specific date for schedule modification
- [0] **7.3** Dynamic loading of the base timetable for the selected date's day
- [0] **7.4** Slot override action form:
  - Status change (`CANCELLED`, `RESCHEDULED`, `SUBSTITUTE`)
  - New time slot picker & new room input
  - Substitute faculty name input
  - Mandatory reason for override (e.g., "Lab maintenance", "Faculty on leave")
- [0] **7.5** Connect override submission to `POST /api/overrides`

### 8. Notification Center & Alert Feed (`public/notifications.html`)
- [0] **8.1** Chronological live feed of all schedule adjustments and notices
- [0] **8.2** Unread alert pill indicator & counter badge
- [0] **8.3** Filter alerts by type (`Cancellations`, `Room Swaps`, `General Notices`)
- [0] **8.4** "Mark all as read" button updating local state / database
- [0] **8.5** Formatted time stamps (e.g. "10 mins ago", "Today at 09:15 AM")

---

## 👥 Shared / Open Module — CR Admin Authentication & Route Guards

> *Login is **ONLY for the Class Representative (CR)**. Regular students and visitors browse all public pages without any login.*

- [0] **9.1** Dedicated CR login portal / modal (`login.html` with CR passcode/credentials)
- [0] **9.2** CR login session persistence (`localStorage.setItem('isCRLoggedIn', 'true')`) and logout handler
- [0] **9.3** Client-side route protection guard (redirect unauthorized visitors trying to access `admin-*.html` to `login.html`)
- [0] **9.4** Navigation bar conditional UI (display "Admin Portal" / "CR Controls" and "Logout" buttons only when CR is authenticated)

---

## 📑 Project Report & Academic Module Breakdown

For your academic project documentation, viva presentation, and report submission, the project is structured into **3 Functional Tiers**:

### Tier 1: Core Engine (Highest Academic Importance)
These modules form the central innovation of the project and demonstrate advanced database querying and business logic:
1. **Module A — Schedule Merging & Aggregation Engine (`GET /api/agenda`)**:
   - Merges the static semester blueprint with volatile single-day overrides using MongoDB Aggregation Pipelines (`$lookup`, `$match`, `$addFields`).
2. **Module B — Date Override & Adjustment Manager (`admin-override-timetable.html`)**:
   - Enables non-destructive timetable changes without corrupting the master template.
3. **Module C — Real-Time Central Dashboard (`index.html`)**:
   - Live "Happening Now" status calculation comparing client system time against lecture time slots.

### Tier 2: Academic Setup & Information Dissemination (Medium Importance)
1. **Module D — Master Schedule Blueprint (`admin-master-timetable.html`)**:
   - Recurring baseline schedule management across departments and semesters.
2. **Module E — Campus Notice & Announcement System (`notices.html`, `admin-add-notice.html`)**:
   - Priority-tiered broadcasting with full-text search and category filtering.
3. **Module F — Student Interactive Schedule Grid (`timetable.html`)**:
   - Multi-view grid rendering (Week vs Master) with dynamic status badges.

### Tier 3: User Experience & Utility (Supporting Importance)
1. **Module G — Live Notification Feed (`notifications.html`)**:
   - Event audit log showing historical changes with read/unread tracking.
2. **Module H — Profile, Preferences & Theme Engine (`profile.html`)**:
   - Role badges, batch preferences, and CSS custom property dark/light theme switching.
3. **Module I — Role-Based Access Control (Authentication)**:
   - Client/server role validation separating Student view rights from CR/Admin edit rights.
