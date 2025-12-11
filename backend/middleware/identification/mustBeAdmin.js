
/**
 * @swagger
 * components:
 *   responses:
 *     mustBeAdmin:
 *       description: User verification requires administrator privileges
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: Admin privileges required
 */

export const mustBeAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).send("Authentication required.");
        }
        const isAdmin = req.user.isAdmin; 
        if (isAdmin === true) {
            return next();
        } else {
            next(new Error("Must be admin"));
        }

    } catch (err) {
        next("error");
    }
};