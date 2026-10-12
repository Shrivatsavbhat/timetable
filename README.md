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

## 👥 Page Architecture & Team Division

| Member | Assigned Pages | Responsibilities |
| :--- | :--- | :--- |
| **Person 1** | `index.html`<br>`admin-add-notice.html` | **Central Portal & Notice Management**<br>• Real-time "Happening Now" lecture countdown<br>• Combined "Today's Agenda" view<br>• Urgent notice marquee/ticker<br>• Admin notice publishing & management table |
| **Person 2** | `timetable.html`<br>`notices.html` | **Student Schedule View & Announcements**<br>• Interactive Timetable Grid (Week View vs Permanent Master)<br>• Department / Semester dropdown filters<br>• Color-coded period cards & alert chips<br>• Filterable notice board & full-text modal |
| **Person 3** | `admin-master-timetable.html`<br>`profile.html` | **Academic Master Setup & User Settings**<br>• Master recurring blueprint grid (Monday–Saturday)<br>• Inputs for Course Code, Subject, Faculty, Room<br>• User profile, batch selector, role display<br>• Dark / Light mode toggle switch |
| **Person 4** | `admin-override-timetable.html`<br>`notifications.html` | **Daily Overrides & Live Alert Feed**<br>• Calendar date-picker for date-specific adjustments<br>• Slot status editor (Rescheduled, Cancelled, Substitute)<br>• Live notification center & update feed<br>• Unread indicators & "Mark all as read" |

---

## 📁 Project Structure

```text
timetable/
├── models/
│   ├── MasterSlot.js              # Permanent weekly timetable schema
│   ├── Override.js                # Date-specific overrides schema
│   └── Notice.js                  # Campus announcements schema
├── public/
│   ├── index.html                 # Person 1: Central Dashboard
│   ├── admin-add-notice.html      # Person 1: Notice Management
│   ├── timetable.html             # Person 2: Student Timetable Grid
│   ├── notices.html               # Person 2: Campus Notices Feed
│   ├── admin-master-timetable.html# Person 3: Master Blueprint
│   ├── profile.html               # Person 3: User Profile & Theme
│   ├── admin-override-timetable.html # Person 4: Daily Override Manager
│   ├── notifications.html         # Person 4: Notification Center
│   ├── css/
│   │   └── style.css              # Shared stylesheets & theme variables
│   ├── scripts/                        # Client-side scripts
│   └── assets/                    # Icons and images
├── .env                           # Environment variables (PORT, MONGO_URI)
├── .gitignore                     # Git ignore rules (node_modules, .env)
├── package.json                   # Project metadata & dependencies
├── README.md                      # Project documentation
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
| `GET` | `/api/agenda?semester=...&day=...&date=...` | Merges master slots with date overrides | Person 1 & 2 |
| `POST` | `/api/master` | Adds a recurring semester slot | Person 3 |
| `POST` | `/api/overrides` | Adds a date-specific class adjustment | Person 4 |
| `GET` | `/api/notices` | Fetches all campus notices | Person 1 & 2 |
| `POST` | `/api/notices` | Publishes a new notice | Person 1 |

---

## 📄 License
This project is licensed under the ISC License.
