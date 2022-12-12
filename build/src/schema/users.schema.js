"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
//create user schema
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "Name is required"
        }),
        password: (0, zod_1.string)({
            required_error: "Password is required"
        }).min(4, 'passwor too short -should be 6 chars minimum '),
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).email('Not a valid email')
    })
});
//login
exports.loginUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }),
    }),
});
