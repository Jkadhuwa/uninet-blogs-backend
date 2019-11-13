import { config } from 'dotenv';
import passport from 'passport';
import { User } from '../sequelize/models';
import { hashedPassword, genToken } from '../helpers/auth';

config();

/**
 * @description Authenticates user
 */
class Authentication {
  /**
   * @description user signup
   * @param {object} req
   * @param {object} res
   * @returns {object} signed up user
   */
  static async signup(req, res) {
    try {
      const { email, userName, password } = req.body;
      const user = await User.findOne({ where: { email } });
      const name = await User.findOne({ where: { userName } });

      if (user) {
        return res.status(409).json({
          error: `Email ${email} already exists`
        });
      }

      if (name) {
        return res.status(409).json({
          error: `userName ${userName} already taken`
        });
      }

      req.body.password = hashedPassword(password);

      if (req.userData) {
        req.body.role = req.userData.role === 'super-admin' ? req.body.role : 'user';
      }

      const createdUser = await User.create(req.body);
      const userToken = genToken(createdUser);

      await User.update(
        {
          role: req.body.role
        },
        {
          where: { userName: req.body.userName },
          returning: true,
          plain: true
        }
      );

      return res.status(201).json({
        data: {
          token: userToken,
          id: createdUser.id,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          userName: createdUser.userName,
          email: createdUser.email,
          role: createdUser.role
        }
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description user login
   * @param {object} req
   * @param {object} res
   * @returns {object} logged in user
   */
  static login(req, res) {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return res.status(401).json({
          error: err.message
        });
      }
      res.status(200).json({
        message: 'Welcome, you are successfully logged in',
        data: {
          token: genToken(user),
          username: user.userName,
          email: user.email
        }
      });
    })(req, res);
  }

  /**
   * @description user logout
   * @param {object} req
   * @param {object} res
   * @returns {object} logged out user
   */
  static async logout(req, res) {
    const token = req.headers.authorization;
    const identifier = token.match(/\d+/g).join(''); // Extract numbers only from token to be used to uniquely identify a token in db
    await DroppedToken.create({ identifier });

    return res.status(200).json({
      message: 'Successfully logged out.'
    });
  }
}

export default Authentication;
