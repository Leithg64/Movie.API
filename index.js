const express = require('express');
const app = express();

  // GET requests
  app.get('/', (req, res) => {
    res.send('View my top 10 favourite movies');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  app.get('/movies', (req, res) => {
    res.json(topFilms);
  });
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
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