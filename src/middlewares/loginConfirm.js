exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        const result = false;
        res.status(403).json(result);
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
       const message = encodeURIComponent('로그인한 상태입니다.');
       res.redirect(`/?error=${message}`);
    }
};
