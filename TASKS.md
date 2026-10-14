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
| **Srijan** | Central Dashboard & Notice Management | `IN PROGRESS` | 0 / 12 |
| **Prajwal** | Student Timetable & Notices Feed | `IN PROGRESS` | 0 / 10 |
| **Royston** | Master Timetable Blueprint & Profile | `IN PROGRESS` | 0 / 10 |
| **Shrivatsa** | Daily Overrides & Notification Center | `IN PROGRESS` | 0 / 10 |
| **Shared / Open** | Authentication & Role System | `OPEN` | 0 / 4 |

---

## 👤 Srijan — Central Portal & Notice Management

### 1. Overview Dashboard & Landing Page (`public/index.html`)
- [0] **1.1** Base layout structure with navigation bar, quick links, and footer
- [0] **1.2** Real-time "Happening Now" lecture status banner with live countdown timer
- [0] **1.3** "Today's Agenda" view dynamically merging master schedule with active overrides
- [0] **1.4** Urgent notice marquee / broadcast ticker at top of page
- [0] **1.5** Quick-stat cards (Total classes today, Active room changes, Cancelled lectures)
- [0] **1.6** Responsive mobile-first layout styling in `public/css/style.css`

### 2. Notice Management Portal (`public/admin-add-notice.html`)
- [0] **2.1** Notice creation form (Title, Priority/Category dropdown, Date picker, Content textarea)
- [0] **2.2** Priority badge selector (`Urgent`, `High`, `Schedule Shift`, `General`)
- [0] **2.3** Form submit handler connecting to `POST /api/notices`
- [0] **2.4** Admin notice management data table displaying all published notices
- [0] **2.5** Status indicator badges on published notices
- [0] **2.6** Edit and Delete controls with confirmation modal (`DELETE /api/notices/:id`)

---

## 👤 Prajwal — Student Schedule View & Announcements

### 3. Interactive Student Timetable Grid (`public/timetable.html`)
- [0] **3.1** Dual-mode top toggle bar: `[ 🗓️ Current Week's Schedule ]` vs `[ 📌 Permanent Master Grid ]`
- [0] **3.2** Department and Semester dropdown filter controls
- [0] **3.3** Monday–Saturday day tabs / column layout
- [0] **3.4** Color-coded lecture period cards (Subject, Faculty, Time, Room)
- [0] **3.5** Visual alert chips on cards highlighting `RESCHEDULED`, `CANCELLED`, or `SUBSTITUTE`
- [0] **3.6** Connect frontend fetch to `GET /api/agenda`

### 4. Campus Notices Feed (`public/notices.html`)
- [0] **4.1** Filterable notice board feed by categories (`All`, `Urgent`, `Schedule Shift`, `General`)
- [0] **4.2** Real-time instant search bar for keyword filtering (Subject, Room, Faculty)
- [0] **4.3** Notice preview cards with priority color tags and publication dates
- [0] **4.4** Pop-up modal dialog for full text review and announcement memos

---

## 👤 Royston — Academic Master Setup & User Settings

### 5. Master Timetable Blueprint (`public/admin-master-timetable.html`)
- [0] **5.1** Administrative recurring weekly grid setup (Monday through Saturday)
- [0] **5.2** Slot configuration inputs: Course Code, Subject Title, Default Faculty, Room/Lab
- [0] **5.3** Slot-level Add / Edit / Remove UI controls
- [0] **5.4** Connect blueprint saving to `POST /api/master`
- [0] **5.5** Master schedule table viewer with semester/department switchers

### 6. User Profile & Preferences (`public/profile.html`)
- [0] **6.1** User credential overview (Name, Student Roll No / Register No, Email)
- [0] **6.2** Role display badge (`Student` vs `Class Representative (CR)`)
- [0] **6.3** Batch and semester selection dropdown saved to user state
- [0] **6.4** Dark / Light mode UI theme toggle with `localStorage` persistence
- [0] **6.5** User alert notification preferences (Email/In-app toggle)

---

## 👤 Shrivatsa — Daily Overrides & Live Alert Feed

### 7. Daily / Weekly Override Manager (`public/admin-override-timetable.html`)
- [0] **7.1** Role-check restriction (Restricted strictly to Class Representative [CR])
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

## 👥 Shared / Open Module — Authentication & Access Control

> *This module is open for anyone in the team to implement or collaborate on.*

- [0] **9.1** Login page / modal with role selection (`Student` vs `Class Representative (CR)`)
- [0] **9.2** Registration / onboarding form
- [0] **9.3** Client-side role persistence (`localStorage.setItem('userRole', role)`)
- [0] **9.4** Navigation bar role-based UI switcher (hide CR management pages from regular students)

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
   - Client/server role validation separating Student view rights from Class Representative (CR) edit rights.

---

## 🔮 Future Implementation (Roadmap)

The following capabilities are designated as future extensions beyond the core mini-project scope:
- **Dedicated Faculty Portal**: Independent instructor authentication, faculty self-service leave requests, and teacher-driven substitute approvals.
- **Automated Instant Alerts**: Automated SMS / WhatsApp / Telegram broadcast webhook integration triggered whenever a CR publishes an override.
- **Cross-Semester Clash Detection**: Smart backend validator ensuring no classroom or faculty member is double-booked across concurrent semester schedules.
