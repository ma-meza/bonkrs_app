const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
module.exports = passport => {
    console.log("PIT PIT 0.5");
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                // const findUser = await pool.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [jwt_payload.id]);
                // if (findUser) {
                //     return done(null, findUser);
                // }
                console.log("PIT PIT");
                return done(null, jwt_payload.id);
            } catch (err) {
                console.log(err)
            }
        })
    );
};

