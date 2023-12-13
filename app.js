var express  = require('express');
var path = require('path');
const fs = require('fs');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         
var port     =  3000;
const customHelpers = require('./custom_helper');
const movieDB = require('./models/movieDB'); 
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middleware/authMiddleware');

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


app.engine(
  'hbs',
  exphbs.engine({
  
    extname: '.hbs',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    handlebars: customHelpers
  })
);
app.set('view engine', 'hbs');


app.use(bodyParser.urlencoded({'extended':'true'}));         
app.use(bodyParser.json());                                    
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(express.static(path.join(__dirname, 'public'))); 
const hbs = exphbs.create({
    handlebars: customHelpers,
    extname: '.hbs', 
    partialsDir: path.join(__dirname, 'views/partials'),
});

hbs.handlebars.registerPartial('header', fs.readFileSync(path.join(__dirname, 'views/partials/header.hbs'), 'utf8'));
hbs.handlebars.registerPartial('footer', fs.readFileSync(path.join(__dirname, 'views/partials/footer.hbs'), 'utf8'));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); //  Set 'hbs' as the view engine for rendering templates.



const mongoDBConnectionString=mongoose.connect(database.url, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false });
const url="mongodb+srv://meetsoni784:admin@cluster0.lrkxg.mongodb.net/sample_mflix"
// var Movies = require('./models/');

const data = {
  plot: " Siddharth has lead a solitary life for thirty years since the death of Moon…",
  genres: ['Drama', 'Romance'],
  runtime: 1098,
  rated: "APPROVED",
  cast: ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'],
  poster: "https://m.media-amazon.com/images/M/MV5BNDAyZjgyOTctMmI0OC00NjBhLTk5OG…",
  title: "sHAMSHER' Through",
  fullplot: "sIDDHARTH has lead a solitary life for thirty years since the death of Moon…",
  languages: ['English'],
  released: new Date('1932-09-24T00:00:00.000Z'),
  directors: ['Director 1'],
  writers: ['Writer 1', 'Writer 2', 'Writer 3', 'Writer 4', 'Writer 5', 'Writer 6'],
  awards: {},
  lastupdated: "2015-04-19 00:49:42.517000000",
  year: 1932,
  imdb: {},
  countries: ['INDIA'],
  type: "movie",
  tomatoes: { num_mflix_comments: 0 }
};

const updateddata= {
  plot: " Siddharth has lead a solitary life for thirty years since the death of Moon…",
  genres: ['Drama', 'Romance'],
  runtime: 1098,
  rated: "APPROVED",
  cast: ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'],
  poster: "https://m.media-amazon.com/images/M/MV5BNDAyZjgyOTctMmI0OC00NjBhLTk5OG…",
  title: "sHAMSHER' Through",
  fullplot: "sIDDHARTH has lead a solitary life for thirty years since the death of Moon…",
  languages: ['English'],
  released: new Date('1932-09-24T00:00:00.000Z'),
  directors: ['Director 1'],
  writers: ['Writer 1', 'Writer 2', 'Writer 3', 'Writer 4', 'Writer 5', 'Writer 6'],
  awards: {},
  lastupdated: "2015-04-19 00:49:42.517000000",
  year: 1932,
  imdb: {},
  countries: ['Bharat'],
  type: "movie",
  tomatoes: { num_mflix_comments: 0 }
};


if(mongoDBConnectionString){
  console.log("connected");
  
}
async function startServer() {
  try {
    await movieDB.initialize(process.env.my_url);

    

    app.listen(3000, () => {
      console.log('Server started on port 3000');


    });
  } catch (error) {
   
    console.error('Error starting the server:', error);
  }
}


startServer();

app.use(authRoutes);

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/search',requireAuth,function(req,res){
  res.render('search');
});

app.get('/api/step3/:param1?/:param2/:param3', async (req, res) => {
  try {
    const param1 = parseInt(req.params.param2);
    const param2 = parseInt(req.params.param3);
    const title = req.params.param1 || null; 

   
    let moviesInfo;

    if (title) {
      moviesInfo = await movieDB.getAllMovies(param1, param2, title);
    } else {
      moviesInfo = await movieDB.getAllMovies(param1, param2);
    }

    console.log(moviesInfo.movies);
    const resultmovies = moviesInfo.movies;
    res.render('viewdata', { movieData: resultmovies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/Movies', async (req, res) => {
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
    await movieDB.addNewMovie(req.body)
    res.send(req.body );

});

app.get('/api/Movies/:param1/:param2/:param3?', async (req, res) => {
  try {
    const param1 = parseInt(req.params.param1);
    const param2 = parseInt(req.params.param2);
    const param3 = req.query.param3 ? req.query.param3 : null;

      console.log(param3);
   
    const movies = await movieDB.getAllMovies(param1, param2,param3);

 
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/Movies/:param1', async (req, res) => {
  const param1 = parseInt(req.params.param1);

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
    await movieDB.updateMovieById(req.body,param1);
    res.send(req.body );
});

app.delete('/api/Movies/:param1', async (req, res) => {
  try {
    const param1 = req.params.param1;
  
 
    const movies = await movieDB.deleteMovieById(param1);

  
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/searchyear',requireAuth,function(req,res){
  res.render('searchyear');
});

app.get('/api/newfeature', async (req, res) => {
  try {
    const { year } = req.query; 

  
    if (year) {
    
      const movieData = await movieDB.getMoviesByYear(year);
      
    res.render('moviesByYear', { movies: movieData});
      
    } else {
    
      res.status(400).json({ error: 'Please provide the year parameter.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


