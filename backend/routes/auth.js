const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  //console.log("Inside Login Auth");
  // Fetch user from the database based on email
  const [user] = await connection.promise().query(
    'SELECT * FROM user_info WHERE email = ?', [email]
  );

  if (user.length === 0) {
    return res.status(401).json({ error: 'User not found' });
  }

  const match = await bcrypt.compare(password, user[0].password);
  //const match = password === user[0].password; 
  if (match) {
    // Generate a token or session for authenticated user
    // Return success response
    return res.json({ success: true });
  } else {
    return res.status(401).json({ error: 'Invalid password' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
    //console.log("Inside Reg Auth");
  try {
    // Check if the email is already registered
    const [existingUser] = await connection.promise().query(
      'SELECT * FROM user_info WHERE email = ?', [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    await connection.promise().query(
      'INSERT INTO user_info (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
