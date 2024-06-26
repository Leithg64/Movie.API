/**
 * Required dependencies
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Movie schema definition
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

/**
 * User schema definition
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Static method to hash a password
 * @param {String} password - The password to hash
 * @returns {String} - The hashed password
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Instance method to validate a password
 * @param {String} password - The password to validate
 * @returns {Boolean} - True if the password is valid, false otherwise
 */
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

/**
 * Movie model based on the movie schema
 */
let Movie = mongoose.model('Movie', movieSchema);

/**
 * User model based on the user schema
 */
let User = mongoose.model('User', userSchema);

/**
 * Export the Movie and User models
 */
module.exports.Movie = Movie;
module.exports.User = User;
