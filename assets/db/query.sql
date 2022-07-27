source schema.sql;
source seeds.sql;

SELECT movie_name
FROM movies
JOIN reviews ON reviews.movie_id = movies.id;

SELECT movie_name, review
FROM movies
JOIN reviews ON reviews.movie_id = movies.id;