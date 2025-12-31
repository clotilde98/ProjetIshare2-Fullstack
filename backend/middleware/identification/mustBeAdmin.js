export const mustBeAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.isAdmin) {
            return next();
        } else if (!req.user) {
            return res.status(401).send("Authentication required.");
        } else {
            return res.status(403).send("Admin privilege required");
        }
    } catch (err) {
        return res.status(500).send("Internal server error : " + err.message);
    }
};