const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  app = express(),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require('express-validator');

//mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI='', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', async (req, res) => {
  res.send("APP loaded :)")
});

// BodyParser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

// Cross Origin Resource Sharing
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080','http://localhost:1234', 'http://testsite.com'];

app.use(cors());

// requires passport
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');  

//returns static page
app.use(express.static('public'));

// morgan
app.use(morgan('common'));

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');

});

let users = [
  {
    id: 1,
    name: "Bill",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Ben",
    favoriteMovies: ["Blade Runner"]
  },
  {
    id: 3,
    name: "Bosco",
    favoriteMovies: ["The Grand Budapest Hotel"]
  },
  {
    id: 4,
    name: "Bob",
    favoriteMovies: ["Memento"]
  },
]

let movies = [
  {
    "Title": "Blade Runner",
    "Description": "A blade runner must pursue and terminate four replicants who stole a sapceship and have returned to Earth to find their creator.",
    "Genre": {
      "Name": "Sci-fi" 
    },
    "Director": {
      "Name": "Riddley Scott"
    }
  }, 
  {
    "Title": "Whiplash",
    "Description": "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    "Genre": {
      "Name": "Drama" 
    },
    "Director": {
      "Name": "Damien Chazelle"
    }
  }, 
  {
    "Title": "The Grand Budapest Hotel",
    "Description": "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
    "Genre": {
      "Name": "Comedy" 
    },
    "Director": {
      "Name": "Wes Anderson"
    }
  }, 
  {
    "Title": "The Fellowship of the Ring",
    "Description": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    "Genre": {
      "Name": "Adventure" 
    },
    "Director": {
      "Name": "Peter Jackson"
    }
  }, 
  {
    "Title": "Pulp Fiction",
    "Description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    "Genre": {
      "Name": "Crime" 
    },
    "Director": {
      "Name": "Quentin Tarantino"
    }
  }, 
  {
    "Title": "Interstellar",
    "Description": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    "Genre": {
      "Name": "Sci-fi" 
    },
    "Director": {
      "Name": "Christopher Nolan"
    }
  }, 
  {
    "Title": "Alien",
    "Description": "The crew of a commercial spacecraft encounters a deadly lifeform after investigating a mysterious transmission of unknown origin.",
    "Genre": {
      "Name": "Horror" 
    },
    "Director": {
      "Name": "Riddley Scott"
    }
  }, 
  {
    "Title": "Raiders of the Lost Ark",
    "Description": "In 1936, archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before the Nazis can obtain its awesome powers.",
    "Genre": {
      "Name": "Adventure" 
    },
    "Director": {
      "Name": "Steven Spielberg"
    }
  }, 
  {
    "Title": "Apocalypse Now",
    "Description": "A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel who sees himself as a god.",
    "Genre": {
      "Name": "Drama" 
    },
    "Director": {
      "Name": "Francis Ford Coppola"
    }
  }, 
  {
    "Title": "Memento",
    "Description": "A man with short-term memory loss attempts to track down his wife's murderer.",
    "Genre": {
      "Name": "Mystery" 
    },
    "Director": {
      "Name": "Chistopher Nolan"
    }
  } 
];

// GET movies with authentication
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Add a user
app.post('/users',
[
  //validation logic for create user request
check('Username', 'Username is required').isLength({min: 5, max:10}),
check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors:errors.array() });
  }
  
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
      //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// GET all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET a user by username
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// UPDATE a user's info by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), 
[
  //validation logic for updating user info
check('Username', 'Username is required').isLength({min: 5, max:10}),
check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(40).send('PERMISSION DENIED');
  }
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set: 
    {
     Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true })
  .then((updateUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  })
});

// GET a movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET a movie by genre
app.get('/movies/:Genre/:Description', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Genre: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET a movie by director
app.get('/movies/:Director', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Director: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' +err)
  });
});

// DELETE a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' +err)
  });
});

// DELETE a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});



