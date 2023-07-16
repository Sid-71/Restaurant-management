const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// making the connection with the postgresql db
const pool = require("./db");

// here this is the global middleware
app.use(express.json());



app.use(bodyParser.json());
 
// So herer are are registering the user
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
 
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // we are not gonna store the password as a plain text
 
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
       await pool.query(query, [username, hashedPassword]);
 
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});
 
// if the user is already registered , then we are gonna just 
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
      
    if(!username || !password){
      res.status(401).json({
        message:"Username and password are missing"
      });
      return;
    }
    
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(query, [username]);

    if (rows.length === 0) {
       
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }
 
    const user = rows[0];
 
    // Compare passwords
    const passwordsMatch = await bcrypt.compare(password, user.password);
 
    if (!passwordsMatch) {
      res.status(401).json({ message: 'Invalid username or password..' });
      return;
    }
 
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key');
 
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});
 
// Middleware to authenticate requests
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
 
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
 
  jwt.verify(token, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
 
    req.userId = decoded.userId;
    next();
  });
};
 
//for checking the  availability
app.get('/availability', async (req, res) => {
  try {
    
    const query = 'SELECT * FROM availability';
    const { rows } = await pool.query(query);
 
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});
 
app.post('/availability', authenticateUser, async (req, res) => {
  try {
    const { date, capacity } = req.body;
 
    // Check if availability already exists for the date
    const existingAvailabilityQuery = 'SELECT * FROM availability WHERE date = $1';
    const { rows } = await pool.query(existingAvailabilityQuery, [date]);
    
    if (rows.length > 0) {
      res.status(409).json({ message: 'Availability already exists for the date' });
      return;
    }
 
    // Storing the availability in the db
    const query = 'INSERT INTO availability (date, capacity) VALUES ($1, $2)';
  
    await pool.query(query, [date, capacity]);
 
    res.status(201).json({ message: 'Availability created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});
 
// Booking and Reservation
app.get('/tables', async (req, res) => {
  try {
    const { date, capacity } = req.query;
 console.log(">..date...",req.query)
    // Retrieve  tables from the db
    const query =
      'SELECT * FROM availability WHERE date = $1 AND capacity >= $2 AND id NOT IN (SELECT availability_id FROM bookings WHERE date = $1)';
    const { rows } = await pool.query(query, [date, capacity]);
 
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});
 
app.post('/bookings', authenticateUser, async (req, res) => {
  try {
    const { date, tableId } = req.body;
   
    const checkAvailabilityQuery =
      'SELECT * FROM availability WHERE availability_id  = $1 AND date = $2 AND availability_id  NOT IN (SELECT availability_id FROM bookings WHERE date = $2)';
    const { rows } = await pool.query(checkAvailabilityQuery, [tableId, date]);
      
    if (rows.length === 0) {
      res.status(404).json({ message: 'Table not available for the selected date' });
      return;
    }
    let availability_id;
   
    // Store the booking in the database
    const bookingQuery = 'INSERT INTO bookings (availability_id, date, user_id) VALUES ($1, $2, $3)';
    await pool.query(bookingQuery, [tableId, date, req.userId]);
 
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.listen(3042, () =>{
    console.log("server is listening on port no. 3042")
})