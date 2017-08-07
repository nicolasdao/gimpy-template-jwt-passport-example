const { serveHttp, app } = require('webfunc')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { ExtractJwt, Strategy } = require("passport-jwt")

const SECRETKEY = 'your-super-secret-key'
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
	secretOrKey: SECRETKEY
}

passport.use(new Strategy(jwtOptions, (decryptedToken, next) => {
	// do more verification based on your requirements.
	return next(null, decryptedToken)
}))

/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.{{entryPoint}} = serveHttp([

	app.get('/', (req, res) => passport.authenticate('jwt', (err, user) => {
		if (user)
			res.status(200).send(`Welcome ${user.username}!`)
		else
			res.status(401).send(`You must be logged in to access this endpoint!`)
	})(req, res)),

	app.post('/signin', (req, res, params) => {
		if (params.email == 'hello@webfunc.co' && params.password == 'supersecuredpassword') {
			const user = {
				id: 1,
				roles: [{
					name: 'Admin',
					company: 'neap pty ltd'
				}],
				username: 'neapnic',
				email: 'hello@webfunc.co'
			}
			res.status(200).send({ message: 'Successfully logged in', token: jwt.sign(user, SECRETKEY) })
		}
		else
			res.status(401).send(`Username or password invalid!`)	
	})
])
