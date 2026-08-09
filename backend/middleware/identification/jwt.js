import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or is invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Unauthorized"
 *               message:
 *                 type: string
 *                 example: "JWT is missing or is invalid"
 */
export const checkJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing or invalid" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.tokenType && decoded.tokenType !== 'access') {
            return res.status(403).json({ message: "Token invalid" });
        }
        
        req.user = {
            id: decoded.id,
            isAdmin: decoded.isAdmin,
        };
        return next();
    } catch (err) {
       
        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token missing or invalid" });
        }

        console.error("JWT verification failed", err);
        return res.status(500).json({ message: "Authentication service unavailable" });
    }
};
