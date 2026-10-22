const express = require('express');
const router = express.Router();
const MasterSlot = require('../models/MasterSlot');
const Override = require('../models/Override');

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

router.get('/', async (req, res) => {
  try {
    const { date, semester, mode } = req.query;

    let dayName = null;
    let dateString = null;

    if (date) {
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        dateString = date;
        dayName = getDayNameFromDate(date);
      } else {
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

    const masterFilter = {};
    if (semester) masterFilter.semester = semester;
    if (dayName) masterFilter.day = dayName;

    console.log(`[Timetable API] Query: date=${dateString || 'all'}, day=${dayName || 'all'}, sem=${semester || 'all'}, mode=${mode || 'merged'}`);

    if (mode === 'permanent') {
      const masterSlots = await MasterSlot.find(masterFilter).sort({ slot: 1 });
      return res.json({
        success: true,
        date: dateString,
        day: dayName,
        schedule: masterSlots
      });
    }

    const masterSlots = await MasterSlot.find(masterFilter).sort({ slot: 1 });

    const overrideFilter = {};
    if (semester) overrideFilter.semester = semester;
    if (dateString) overrideFilter.date = dateString;

    const overrides = await Override.find(overrideFilter).sort({ createdAt: -1 });



    const mergedSchedule = masterSlots.map(slot => {
      const override = overrides.find(o => {
        if (String(o.slot) !== String(slot.slot)) return false;
        if (dateString) return o.date === dateString;
        return getDayNameFromDate(o.date) === slot.day;
      });
      if (override) {
        if (override.status === 'SWAPPED' && override.newSlot) {
          const partnerSlot = masterSlots.find(s => s.day === slot.day && String(s.slot) === String(override.newSlot));
          if (partnerSlot) {
            return {
              ...slot.toObject(),
              isOverridden: true,
              status: 'SWAPPED',
              subject: partnerSlot.subject,
              code: partnerSlot.code,
              faculty: partnerSlot.faculty,
              isLab: partnerSlot.isLab,
              room: override.newRoom || partnerSlot.room,
              newRoom: override.newRoom || partnerSlot.room,
              newSlot: override.newSlot,
              swappedWithSubject: slot.subject,
              reason: override.reason
            };
          }
        }
        return {
          ...slot.toObject(),
          isOverridden: true,
          status: override.status,
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
