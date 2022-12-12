"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyTokenAndAuthorization = exports.VerifyTokenAndReissue = void 0;
const lodash_1 = require("lodash");
const jwt_utils_1 = require("../utils/jwt.utils");
const auth_service_1 = require("../services/auth.service");
const VerifyTokenAndReissue = async (req, res, next) => {
    const accessToken = (0, lodash_1.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    const refreshToken = (0, lodash_1.get)(req, "headers.x-refresh");
    if (!accessToken) {
        res.status(403).json('you are not allowed to do it');
    }
    else {
        const { decoded, expired } = (0, jwt_utils_1.verifyJwt)(accessToken, "accessTokenSecret");
        if (decoded) {
            //@ts-ignore
            req.user = decoded;
            return next();
        }
        else if (expired && refreshToken) {
            const newAccessToken = await (0, auth_service_1.reIssueAccessToken)({ refreshToken });
            if (newAccessToken) {
                res.setHeader("x-access-token", newAccessToken);
                const result = (0, jwt_utils_1.verifyJwt)(newAccessToken, "accessTokenSecret");
                //@ts-ignore
                req.user = result.decoded;
                return next();
            }
            else {
                res.json('cannot send new access token');
            }
        }
        else {
            res.status(403).json('token not valid');
        }
    }
};
exports.VerifyTokenAndReissue = VerifyTokenAndReissue;
const verifyTokenAndAuthorization = (req, res, next) => {
    (0, exports.VerifyTokenAndReissue)(req, res, () => {
        //@ts-ignore
        const user = req.user;
        if (user.id === req.params.id || user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};
exports.verifyTokenAndAuthorization = verifyTokenAndAuthorization;
const verifyAdmin = async (req, res, next) => {
    (0, exports.VerifyTokenAndReissue)(req, res, () => {
        //@ts-ignore
        const user = req.user;
        if (user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};
exports.verifyAdmin = verifyAdmin;
