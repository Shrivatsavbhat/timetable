# 📅 Reschedule

> **Never show up to the wrong lecture again.**

A real-time, responsive campus timetable platform designed to solve the disconnect between rigid semester master schedules and unpredictable daily class adjustments.

---

## 💡 Core Philosophy

Instead of burying schedule shifts, room swaps, and cancellations in noisy chat groups, **Reschedule** maintains a permanent baseline master timetable alongside a date-specific override layer. Students and faculty always see what is actually happening today.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS, JavaScript (ES6+ / Fetch API)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas Cloud) with Mongoose ODM
- **Environment**: Dotenv, CORS

---

## 👥 Team Division & Page Architecture

> [!IMPORTANT]
> **1. Administrative Scope: Class Representative (CR) as Sole Administrator**  
> In **Reschedule**, the designated administrator is the **Class Representative (CR)**. The CR manages both layers of schedule data:
> - **Permanent Master Blueprint (`admin-master-timetable.html`)**: The baseline semester schedule (Monday–Saturday) that remains constant throughout the semester. The CR updates this only for permanent structural changes (e.g., permanent teacher reallocation or syllabus remakes).
> - **Daily / Weekly Overrides (`admin-override-timetable.html`)**: Temporary, date-specific adjustments (daily cancellations, temporary room swaps, substitute professors) published by the CR without modifying the underlying permanent blueprint.
> - **Notice Management (`admin-add-notice.html`)**: Publishing urgent memos and broadcast notifications to students.
>
> **2. Authentication Architecture: CR Login Only (Zero Friction for Students)**  
> - **Students / Visitors**: **No login required.** Students have direct, friction-free access to browse the live dashboard, timetable grid, campus notices, and notifications.
> - **Class Representative (CR)**: Requires logging in through a secure gateway (`login.html`) to access administrative management tools (`admin-*.html`).
>
> **3. Faculty Portal**: Dedicated faculty self-service accounts and teacher-managed approvals are designated as a **Future Implementation**.

| Member | Assigned Pages | Key Responsibilities |
| :--- | :--- | :--- |
| **Srijan** | `index.html`<br>`admin-add-notice.html` | **Central Portal & Notice Management**<br>• Real-time "Happening Now" lecture countdown & status banner<br>• Combined "Today's Agenda" view merging master slots with date overrides<br>• Urgent notice broadcast marquee/ticker<br>• CR notice publishing form & management table with Edit/Delete controls |
| **Prajwal** | `timetable.html`<br>`notices.html` | **Student Schedule View & Announcements (No Login Required)**<br>• Interactive Timetable Grid (Current Week vs Permanent Master Grid)<br>• Department / Semester dropdown filters<br>• Color-coded period cards highlighting rescheduled/cancelled classes<br>• Campus Notices Feed with category filter and search modal |
| **Royston** | `admin-master-timetable.html` | **Permanent Academic Master Blueprint**<br>• Permanent recurring weekly blueprint grid (Monday–Saturday constant template)<br>• Blueprint inputs: Course Code, Subject, Default Faculty, Room/Lab |
| **Shrivatsa** | `admin-override-timetable.html`<br>`notifications.html` | **Daily / Weekly Overrides & Live Alert Feed**<br>• Daily / Weekly Override Manager (CR login required)<br>• Calendar date-picker & slot status editor (Cancelled, Rescheduled, Substitute)<br>• Live Notification Center displaying all timetable shifts & memos<br>• Unread alert counter pill & "Mark all as read" button |
| **Shared / Open** | `login.html` | **CR Admin Authentication (CR Only)**<br>• Admin login gateway exclusively for the Class Representative (CR)<br>• Protected route redirects (protects `admin-*.html` while keeping student pages public)<br>• CR session persistence & navbar Admin/Logout toggle |

---

## 📑 System Modules Breakdown (For Project Report)

For project documentation, report submission, and viva presentations, the system is organized into three tiers of importance:

### Tier 1: Core Engine (High Importance)
- **Module 1: Schedule Aggregation & Merging Engine**: MongoDB Aggregation Pipeline (`$lookup`, `$match`, `$addFields`) dynamically merging static master schedules with date-specific overrides.
- **Module 2: Daily & Weekly Override Manager**: Non-destructive slot adjustment system (status change, room reassignment, substitute faculty) published by the CR without altering the permanent semester blueprint.
- **Module 3: Real-Time Central Dashboard**: Client-side countdown calculation evaluating current device time against lecture periods with visual state chips.

### Tier 2: Academic Setup & Communications (Medium Importance)
- **Module 4: Permanent Master Schedule Blueprint**: Recurring Monday–Saturday baseline schedule template maintained by the CR for the entire semester.
- **Module 5: Campus Notice & Announcement System**: Categorized notice publishing with instant keyword search and modal details.
- **Module 6: Interactive Student Timetable Grid**: Multi-view schedule display with visual alert chips for cancellations and room changes (no student login required).

### Tier 3: User Experience & Utility (Supporting Importance)
- **Module 7: Live Notification Center**: Chronological audit feed of timetable events with unread tracking.
- **Module 8: Accessibility & Theme Customization**: Continuous text sizing and CSS theme persistence (`localStorage`).
- **Module 9: Access Control & Admin Login Gatekeeper**: Single administrative login protecting CR management routes (`admin-*.html`), while keeping all student pages accessible without authentication.

---

## 📁 Project Structure

```text
timetable/
├── models/
│   ├── MasterSlot.js              # Permanent weekly timetable schema
│   ├── Override.js                # Date-specific overrides schema
│   └── Notice.js                  # Campus announcements schema
├── public/
│   ├── index.html                 # Srijan: Central Dashboard
│   ├── admin-add-notice.html      # Srijan: Notice Management
│   ├── timetable.html             # Prajwal: Student Timetable Grid
│   ├── notices.html               # Prajwal: Campus Notices Feed
│   ├── admin-master-timetable.html# Royston: Master Blueprint Setup
│   ├── admin-override-timetable.html # Shrivatsa: Daily Override Manager
│   ├── notifications.html         # Shrivatsa: Notification Center
│   ├── css/
│   │   └── style.css              # Shared stylesheets & theme variables
│   ├── scripts/                   # Client-side scripts
│   └── assets/                    # Icons and images
├── .env                           # Environment variables (PORT, MONGO_URI)
├── .gitignore                     # Git ignore rules (node_modules, .env)
├── package.json                   # Project metadata & dependencies
├── README.md                      # Project documentation
├── TASKS.md                       # Subtask tracker (0 = In-progress, 1 = Done)
└── server.js                      # Express API server & static host
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) connection string (or local MongoDB)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Shrivatsavbhat/timetable.git
cd timetable
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string_here
```

### 4. Running the Application
Start the server in watch mode:
```bash
node --watch server.js
```
Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Used By |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health-check endpoint | System |
| `GET` | `/api/agenda?semester=...&day=...&date=...` | Merges master slots with date overrides | Srijan & Prajwal |
| `POST` | `/api/master` | Adds a recurring semester slot | Royston |
| `POST` | `/api/overrides` | Adds a date-specific class adjustment | Shrivatsa |
| `GET` | `/api/notices` | Fetches all campus notices | Srijan & Prajwal |
| `POST` | `/api/notices` | Publishes a new notice | Srijan |

---

## 📋 Task & Progress Tracking
Team members update their task status from `[0]` to `[1]` in [TASKS.md](file:///c:/Codes/MIt/WT/timetable/TASKS.md) upon completing and testing each subtask, then commit the change to Git.

---

## 🔮 Future Implementation (Roadmap)

- **Dedicated Faculty Portal**: Independent instructor authentication, faculty self-service leave requests, and teacher-driven substitute approvals (in current scope, all operational administrative duties are managed by the **Class Representative**).
- **Automated Instant Alerts**: Automated SMS / WhatsApp / Telegram broadcast webhook integration triggered whenever a CR publishes an override.
- **Cross-Semester Clash Detection**: Smart backend validator ensuring no classroom or faculty member is double-booked across concurrent semester schedules.

---

## 📄 License
This project is licensed under the ISC License.
