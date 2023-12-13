const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

// Connection URL
const url = 'mongodb+srv://meetsoni784:admin@cluster0.lrkxg.mongodb.net"';

// Database Name
const dbName = 'sample_mflix';

// Create a new movie in the collection
app.post('/api/Movies', async (req, res) => {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('movies');

    // Extract movie data from the request body
    const {   plot,
        genres,
        runtime,
        rated,
        cast,
        poster,
        title,
        fullplot,
        languages,
        released,
        directors,
        writers,
        awards,
        lastupdated,
        year,
        imdb,
        countries,
        type,
        tomatoes } = req.body;
        console.log(req.body);

    // Create the movie object
    const newMovie = {
        plot,
        genres,
        runtime,
        rated,
        cast,
        poster,
        title,
        fullplot,
        languages,
        released,
        directors,
        writers,
        awards,
        lastupdated,
        year,
        imdb,
        countries,
        type,
        tomatoes
      // Add more fields as needed
    };


    console.log(newMovie);
    // Insert the new movie document into the collection
    const result = await collection.insertOne(newMovie);

    if (result.insertedCount === 1) {
      console.log('New movie added:', newMovie);
      res.status(201).json({ success: true, movie: newMovie });
    } else {
      console.log('Failed to add new movie');
      res.status(500).json({ success: false, message: 'Failed to add new movie' });
    }
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ success: false, message: 'An error occurred while adding the movie' });
  } finally {
    // Close the client connection
    await client.close();
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
