const express = require('express');
const router = express.Router();
const MasterSlot = require('../models/MasterSlot');
const Override = require('../models/Override');

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to determine day of week from YYYY-MM-DD without UTC offset bugs
function getDayNameFromDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return DAYS[new Date(y, m - 1, d).getDay()];
  }
  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime()) ? DAYS[parsed.getDay()] : null;
}

// GET /api/timetable?date=2026-10-21&semester=I MCA-A&mode=permanent
router.get('/', async (req, res) => {
  try {
    const { date, semester, mode } = req.query;

    // 1. Parse date, dayName, and dateString safely
    let dayName = null;
    let dateString = null;

    if (date) {
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        dateString = date;
        dayName = getDayNameFromDate(date);
      } else {
        // Handle full date string or object (e.g. from new Date())
        const cleanDateStr = typeof date === 'string' ? date.replace('GMT ', 'GMT+') : date;
        const parsed = new Date(cleanDateStr);
        if (!isNaN(parsed.getTime())) {
          dayName = DAYS[parsed.getDay()];
          const y = parsed.getFullYear();
          const m = String(parsed.getMonth() + 1).padStart(2, '0');
          const d = String(parsed.getDate()).padStart(2, '0');
          dateString = `${y}-${m}-${d}`;
        }
      }
    }

    // 2. Build master filter without overwriting semester
    const masterFilter = {};
    if (semester) masterFilter.semester = semester;
    if (dayName) masterFilter.day = dayName;

    console.log(`[Timetable API] Query: date=${dateString || 'all'}, day=${dayName || 'all'}, sem=${semester || 'all'}, mode=${mode || 'merged'}`);

    // 3. Permanent Mode (Raw blueprint with no overrides)
    if (mode === 'permanent') {
      const masterSlots = await MasterSlot.find(masterFilter).sort({ slot: 1 });
      return res.json({
        success: true,
        date: dateString,
        day: dayName,
        schedule: masterSlots
      });
    }

    // 4. Merged Mode (Default: Master slots + Overrides)
    const masterSlots = await MasterSlot.find(masterFilter).sort({ slot: 1 });

    const overrideFilter = {};
    if (semester) overrideFilter.semester = semester;
    if (dateString) overrideFilter.date = dateString;

    const overrides = await Override.find(overrideFilter);

    const mergedSchedule = masterSlots.map(slot => {
      // Find override matching slot number AND day/date
      const override = overrides.find(o => {
        if (String(o.slot) !== String(slot.slot)) return false;
        if (dateString) return o.date === dateString;
        return getDayNameFromDate(o.date) === slot.day;
      });

      if (override) {
        return {
          ...slot.toObject(),
          isOverridden: true,
          status: override.status, // 'CANCELLED', 'RESCHEDULED', 'SUBSTITUTE', 'SWAPPED'
          newRoom: override.newRoom || slot.room,
          newSlot: override.newSlot || slot.slot,
          substituteFaculty: override.substituteFaculty || null,
          reason: override.reason
        };
      }

      return {
        ...slot.toObject(),
        isOverridden: false,
        status: 'CONFIRMED'
      };
    });

    res.json({
      success: true,
      date: dateString,
      day: dayName,
      schedule: mergedSchedule
    });

  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch timetable' });
  }
});

module.exports = router;
