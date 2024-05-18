const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');

let generateJWTToken = (user) => {
return jwt.sign(user, jwtSecret, {
subject: user.Username,
expiresIn: '7d',
algorithm: 'HS256'
});
};

// POST login
module.exports = (router) => {
router.post('/login', (req, res) => {
passport.authenticate('local', { session: false }, (error, user, info) => {
if (error) {
console.error('Authentication error:', error);
return res.status(400).json({
message: 'Authentication error',
error: error.message
});
}
if (!user) {
console.warn('Authentication failed:', info);
return res.status(400).json({
message: 'Authentication failed',
info: info.message
});
}
req.login(user, { session: false }, (loginError) => {
if (loginError) {
console.error('Login error:', loginError);
return res.status(400).json({
message: 'Login error',
error: loginError.message
});
}
let token = generateJWTToken(user.toJSON());
return res.json({ user, token });
});
})(req, res);
});
};