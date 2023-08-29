const secret = "21a524f1-efd1-43bf-bacc-2d814da33069";
const jwt = require("jsonwebtoken");
const { findUserPerId } = require("../queries/user.queries");
const { app } = require("../app");

const createJwtToken = ({ user = null, id = null }) => {
  const jwtToken = jwt.sign(
    {
      sub: id || user._id.toString(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    secret
    // { expiresIn: 60 * 5 }
  );
  return jwtToken;
};

// on crée la constance plus haut pour l'utiliser dans addJwtFeatures puis on exporte avec le même nom
exports.createJwtToken = createJwtToken;

const checkExpirationToken = (token, res) => {
  const tokenExp = token.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  if (nowInSec < tokenExp) {
    return token;
  } else if (nowInSec > tokenExp && nowInSec - tokenExp < 60 * 60 * 24) {
    const refreshedToken = createJwtToken({ id: token.sub });
    res.cookie("jwt", refreshedToken);
    return jwt.verify(refreshedToken, secret);
  } else {
    throw new Error("token expired");
  }
};

const decodeJwtToken = (token) => {
  return jwt.verify(token, secret);
};

exports.decodeJwtToken = decodeJwtToken

const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      // pour éviter erreur, on décode quand même le token si expiré grâce à ignoreExpiration afin de garder la mécanique de refresh dans le try
      let decodedToken = jwt.verify(token, secret, {
        ignoreExpiration: true,
      });
      decodedToken = checkExpirationToken(decodedToken, res);
      const user = await findUserPerId(decodedToken.sub);
      if (user) {
        req.user = user;
        next();
      } else {
        res.clearCookie("jwt");
        res.redirect("/");
      }
    } catch (err) {
      res.clearCookie("jwt");
      res.redirect("/");
    }
  } else {
    next();
  }
};

// middleware qui permet d'avoir des méthodes utiles appelées 'helpers', sur l'objet req
const addJwtFeatures = (req, res, next) => {
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie("jwt");
  req.login = (user) => {
    const token = createJwtToken({ user });
    res.cookie("jwt", token);
  };
  next();
};

// on étend les middlewares à l'application
app.use(extractUserFromToken);
app.use(addJwtFeatures);
