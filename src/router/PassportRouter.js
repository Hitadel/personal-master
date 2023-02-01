const passport = require('passport');
const PassportRouter = express.Router();

PassportRouter.post("/login", passport.authenticate('local', {
    failureRedirect: '/'
  }), (req, res) => {
    res.redirect('/');
  });

export default PassportRouter;
