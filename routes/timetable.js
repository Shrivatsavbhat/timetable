const express = require('express');
const router = express.Router();
const MasterSlot = require('../models/MasterSlot');
const Override = require('../models/Override');


router.get('/', async (req, res) => {
  try {
    const { date, semester, mode } = req.query;

    console.log(date, semester);
    if (mode == 'permanent') {

      const targetDate = date ? new Date(date) : null;
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = targetDate ? days[targetDate.getDay()] : null;
      const dateString = targetDate ? targetDate.toISOString().split('T')[0] : null;


      let masterFilter;
      if (dateString === null) {
        masterFilter = {};
      }
      else {
        masterFilter = { day: dayName };
      }

      if (semester) masterFilter.semester = semester;
      const masterSlots = await MasterSlot.find(masterFilter).sort({ slot: 1 });

      res.json({
        success: true,
        date: dateString,
        day: dayName,
        schedule: masterSlots
      });
    } else {
      let masterFilter;
      const targetDate = date ? new Date(date) : new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[targetDate.getDay()];
      const dateString = targetDate.toISOString().split('T')[0];
      const overrideSlot = await MasterSlot.find({ masterFilter }).sort({ slot: 1 });


      // 3. Fetch Overrides for this specific date

      const overrideFilter = { date: dateString };
      if (semester) overrideFilter.semester = semester;
      const overrides = await Override.find(overrideFilter); t
      const mergedSchedule = overrideSlot.map(slot => {
        const override = overrides.find(o => o.slot === slot.slot);

        if (override) {
          return {
            ...slot.toObject(),
            isOverridden: true,
            status: override.status,           // 'CANCELLED', 'RESCHEDULED', 'SUBSTITUTE'
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
    }

  } catch (error) {
    console.error('Error merging timetable:', error);
    res.status(500).json({ error: 'Failed to fetch merged timetable' });
  }
});



module.exports = router;
