Movie API

Welcome to the Movie API project! The objective of this project is to build the server-side component of a “movies” web application. 
The web application will provide users with access to information about different movies, directors, and genres. 
Users can sign up, update their personal information, and create a list of their favorite movies.

Getting Started
To get started with using this API, follow these simple steps:

Clone the repository to your local machine:
git clone https://github.com/Leithg64/movie.api.git

Navigate to the project directory:
cd movie.api

Install dependencies:
npm install

Start the server:
npm start

Endpoints:
This API exposes the following endpoints:

/movies: Get a list of all movies.
/movies/:id: Get detailed information about a specific movie by its ID.
/directors: Get a list of all directors.
/directors/:name: Get detailed information about a specific director by their name.
/genres: Get a list of all genres.
/genres/:genre: Get a list of movies belonging to a specific genre.
Authentication
This API currently does not require authentication. However, if you plan to deploy it in a production environment, it's recommended to implement authentication mechanisms to secure your endpoints.


License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
If you have any questions or need further assistance, feel free to contact me at leithgwrk22@gmail.com.
