import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { unhashedPassword } from '../../helpers/auth';
import { User } from '../../sequelize/models';

passport.serializeUser((user, done) => {
  done(null, user);
});

const passportConfig = () => {
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      /**
       * @param {object} req
       * @param {object} email
       * @param {object} password
       * @param {object} done
       * @returns {object} logged in user information or error.
       */
      async (req, email, password, done) => {
        try {
          ({ email, password } = req.body);
          const user = await User.findOne({
            where: {
              email
            }
          });
          if (!user || !unhashedPassword(password, user.password)) {
            return done({ message: 'Incorrect email or password' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default passportConfig;
