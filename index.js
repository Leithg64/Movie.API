const express = require('express'),
  morgan = require('morgan'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

  app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Bill",
    favoriteMovies: ["Pulp Fiction"]
  },
  {
    id: 2,
    name: "Ben",
    favoriteMovies: ["Blade Runner"]
  },
  {
    id: 2,
    name: "Bosco",
    favoriteMovies: ["The Grand Budapest Hotel"]
  },
  {
    id: 2,
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
morgan = require('morgan');
app.use(morgan('common'));


// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');

});

//CREATE
app.post('/user', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('Users need names')
  }

})

//UPDATE
app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updateUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('No such user')
  }

})

//CREATE
app.post('/user/:id/:movieTitle', (req, res) => {
  const { id, MovieTitle } = req.params;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been sent to user ${id}'s array`);
  } else {
    res.status(400).send('No such user')
  }

})

//DELETE
app.delete('/user/:id/:movieTitle', (req, res) => {
  const { id, MovieTitle } = req.params;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favorirteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('No such user')
  }

})

//DELETE
app.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  
  let user = users.find( user => user.id == id );

  if (user) {
    user = users = user.filter( user => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send('No such user')
  }

})


//READ endpoint
app.get('/movies', (rep, res) => {
  res.status(200).json(movies);
})

//READ endpoint
app.get('/movies/:title', (rep, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('No such movie')
  }

})

//READ endpoint
app.get('/movies/genre/:genreName', (rep, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('No such genre')
  }

})

//READ endpoint
app.get('/movies/director/:directorName', (rep, res) => {
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



