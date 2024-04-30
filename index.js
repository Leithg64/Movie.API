const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

app.use(bodyParser.json());

  // GET requests
  app.get('/', (req, res) => {
    res.send('View my top 10 favorite movies');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  app.get('/movies', (req, res) => {
    res.json(topFilms);
  });

  //returns static page
  app.use(express.static('public'));

  // morgan
  const express = require('express'),
  morgan = require('morgan');
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
    favoriteMovies: []
  },
]

let favoriteMovies = [
  {
    "Title": "Blade Runner",
    "Description": "",
    "Genre": {
      "Name": "Neo-noir" 
    },
    "Director": {
      "Name": "Riddley Scott"
    }
  }, 
  {
    "Title": "Whiplash",
    "Description": "",
    "Genre": {
      "Name": "Drama" 
    },
    "Director": {
      "Name": "Damien Chazelle"
    }
  }, 
  {
    "Title": "The Grand Budapest Hotel",
    "Description": "",
    "Genre": {
      "Name": "Comedy" 
    },
    "Director": {
      "Name": "Wes Anderson"
    }
  }, 
  {
    "Title": "The Fellowship of the Ring",
    "Description": "",
    "Genre": {
      "Name": "Adventure" 
    },
    "Director": {
      "Name": "Peter Jackson"
    }
  }, 
  {
    "Title": "Pulp Fiction",
    "Description": "",
    "Genre": {
      "Name": "Crime" 
    },
    "Director": {
      "Name": "Quentin Tarantino"
    }
  }, 
  {
    "Title": "Interstellar",
    "Description": "",
    "Genre": {
      "Name": "Sci-fi" 
    },
    "Director": {
      "Name": "Christopher Nolan"
    }
  }, 
  {
    "Title": "Alien",
    "Description": "",
    "Genre": {
      "Name": "Horror" 
    },
    "Director": {
      "Name": "Riddley Scott"
    }
  }, 
  {
    "Title": "Raiders of the Lost Ark",
    "Description": "",
    "Genre": {
      "Name": "Adventure" 
    },
    "Director": {
      "Name": "Steven Spielberg"
    }
  }, 
  {
    "Title": "Apocalypse Now",
    "Description": "",
    "Genre": {
      "Name": "Drama" 
    },
    "Director": {
      "Name": "Francis Ford Coppola"
    }
  }, 
  {
    "Title": "Memento",
    "Description": "",
    "Genre": {
      "Name": "Mystery" 
    },
    "Director": {
      "Name": "Chistopher Nolan"
    }
  } 
];

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



