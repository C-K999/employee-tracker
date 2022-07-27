const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'movies_db'
  },
  console.log(`Connected to the courses_db database.`)
);

// Route to posting movies
app.post('/api/add-movie',(req, res) => {
    const sql = `INSERT INTO movies (movie_name) VALUES (?)`;
    const params = [body.movie.name];

    db.query(sql, params, (err, result) => {
        if(err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    })
});

// Route to a list of movies
app.get('/api/movies',(req, res) => {
    // Query database
    db.query('SELECT movie_name FROM movies JOIN reviews ON reviews.movie_id = movies.id;', (err, results) => {
        res.json(results);
        console.log(results);
    });
});

// Route to a list of movies and reviews
app.get('/api/movies-reviews',(req,res) => {
    const sql = 'SELECT movies.movie_name AS movie, reviews.review FROM reviews LEFT JOIN movies ON reviews.movies.id';
    db.query(sql,(err, rows)=> {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message:'success',
            data:rows
        });
    });
});

app.put('/api/review/:id',(req,res) => {
    const sql = 'UPDATE reviews SET review =? WHERE id = ?';
    const params = [req.body.review, req.params.id];

    db.query(sql, params, (err, result) => {
        if(err){
            res.status(500).json({error: err.message});
        }else if(!result.affectedRows) {
            res.json({
                message: 'Movie not found'
            });
        }else{
            res.json({
                message: 'Success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
