const express = require('express');
const {Pool} = require('pg');
require('dotenv').config();

const app = express();

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

(async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS greetings (
        id SERIAL PRIMARY KEY,
        timeOfDay TEXT NOT NULL,
        language TEXT NOT NULL,
        greetingMessage TEXT NOT NULL,
        tone TEXT NOT NULL
      )
    `);

        await seedDatabase();
        console.log('Database initialized and seeded.');
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
})();

// Seed the database with initial data
async function seedDatabase() {
    const greetings = [
        // English Greetings
        {timeOfDay: 'Morning', language: 'English', greetingMessage: 'Good morning', tone: 'Formal'},
        {timeOfDay: 'Afternoon', language: 'English', greetingMessage: 'Good afternoon', tone: 'Formal'},
        {timeOfDay: 'Evening', language: 'English', greetingMessage: 'Good evening', tone: 'Formal'},
        {timeOfDay: 'Morning', language: 'English', greetingMessage: 'Morning My friend!', tone: 'Casual'},
        {timeOfDay: 'Afternoon', language: 'English', greetingMessage: 'Hey!!!', tone: 'Casual'},
        {timeOfDay: 'Evening', language: 'English', greetingMessage: 'Hi there! Have a great evening', tone: 'Casual'},

        {timeOfDay: 'Morning', language: 'German', greetingMessage: 'Guten Morgen', tone: 'Formal'},
        {timeOfDay: 'Afternoon', language: 'German', greetingMessage: 'Guten Tag', tone: 'Formal'},
        {timeOfDay: 'Evening', language: 'German', greetingMessage: 'Guten Abend', tone: 'Formal'},
        {timeOfDay: 'Morning', language: 'German', greetingMessage: 'Hallo!', tone: 'Casual'},
        {timeOfDay: 'Afternoon', language: 'German', greetingMessage: 'Hi!', tone: 'Casual'},
        {timeOfDay: 'Evening', language: 'German', greetingMessage: 'Servus!', tone: 'Casual'},

        {timeOfDay: 'Morning', language: 'Turkish', greetingMessage: 'Gunaydin', tone: 'Formal'},
        {timeOfDay: 'Afternoon', language: 'Turkish', greetingMessage: 'Iyi gunler', tone: 'Formal'},
        {timeOfDay: 'Evening', language: 'Turkish', greetingMessage: 'Iyi aksamlar', tone: 'Formal'},
        {timeOfDay: 'Morning', language: 'Turkish', greetingMessage: 'Merhaba!', tone: 'Casual'},
        {timeOfDay: 'Afternoon', language: 'Turkish', greetingMessage: 'Selam!', tone: 'Casual'},
        {timeOfDay: 'Evening', language: 'Turkish', greetingMessage: 'Naber?', tone: 'Casual'}
    ];

    const insertQuery =
        'INSERT INTO greetings (timeOfDay, language, greetingMessage, tone) VALUES ($1, $2, $3, $4)';

    for (const greeting of greetings) {
        const existing = await pool.query(
            'SELECT id FROM greetings WHERE timeOfDay = $1 AND language = $2 AND greetingMessage = $3 AND tone = $4',
            [greeting.timeOfDay, greeting.language, greeting.greetingMessage, greeting.tone]
        );

        if (existing.rows.length === 0) {
            await pool.query(insertQuery, [
                greeting.timeOfDay,
                greeting.language,
                greeting.greetingMessage,
                greeting.tone,
            ]);
        }
    }
}

// API endpoint to get a greeting
app.post('/api/greet', async (req, res) => {
    let { timeOfDay, language, tone } = req.body;

    if (!timeOfDay || !language || !tone) {
        return res
            .status(400)
            .json({ error: 'timeOfDay, language, and tone are required' });
    }

    timeOfDay = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1).toLowerCase();
    language = language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
    tone = tone.charAt(0).toUpperCase() + tone.slice(1).toLowerCase();

    try {
        const result = await pool.query(
            `SELECT greetingMessage FROM greetings
             WHERE timeOfDay = $1 AND language = $2 AND tone = $3`,
            [timeOfDay, language, tone]
        );
        const greeting = result.rows[0];

        if (greeting) {
            res.json({ greetingMessage: greeting.greetingmessage });
        } else {
            res.status(404).json({ error: 'Greeting not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// API endpoint to get times of day
app.get('/api/timesOfDay', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT timeOfDay FROM greetings');
        res.json({message: 'success', data: result.rows});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// API endpoint to get languages
app.get('/api/languages', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT language FROM greetings');
        res.json({message: 'success', data: result.rows});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = app;

//.env update
