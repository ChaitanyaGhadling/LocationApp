const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location')
const bodyParser = require('body-parser');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/location', locationRoutes);

// Start the server 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
