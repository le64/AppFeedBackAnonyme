const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuration MySQL (à adapter)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'feedback_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Route pour soumettre un feedback
app.post('/api/feedback', async (req, res) => {
  const { type, comment } = req.body;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO feedbacks (type, comment, created_at) VALUES (?, ?, NOW())',
      [type, comment]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// Route pour récupérer les feedbacks (admin)
app.get('/api/feedbacks', async (req, res) => {
  try {
    const [feedbacks] = await pool.execute('SELECT * FROM feedbacks ORDER BY created_at DESC');
    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));