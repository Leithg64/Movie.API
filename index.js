const express = require('express'),
  morgan = require('morgan'),
  app = express(),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  uuid = require('uuid');

const Moviers = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

// BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// GET requests
 app.get('/', (req, res) => {
  res.send('View my top 10 favorite movies');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

//returns static page
app.use(express.static('public'));

// morgan
app.use(morgan('common'));


// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');

});

//Add a user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// GET all users
app.get('/users', async (req, res) => {
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
app.get('/users/:username', async (req, res) => {
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
app.put('/users/:Username', async (req, res) => {
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

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
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

// DELETE a user by username
app.delete('/users/:Username', async (req, res) => {
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

//UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('No such user')
  }

})

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been sent to user ${id}'s array`);
  } else {
    res.status(400).send('No such user')
  }

})

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favorirteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('No such user')
  }

})

//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send('No such user')
  }

})

//READ 
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
})

//READ 
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('No such movie')
  }

})

//READ 
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('No such genre')
  }

})

//READ 
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('No such director')
  }

})

// listen for requests
app.listen(8080, () => console.log('Your app is listening on port 8080.'))



