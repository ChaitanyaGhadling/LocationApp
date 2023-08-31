const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/add', async (req, res) => {
    console.log('Inside Backend');
    const { email, datetime, latitude, longitude } = req.body;
    try {
      await connection.promise().query(
        'INSERT INTO user_location (email, datetime, latitude, longitude) VALUES (?, ?, ?, ?)',
        [email, datetime, latitude, longitude]
      );
      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error storing location data' });
    }
  });
  
  module.exports = router;