"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        desc: (0, zod_1.string)({
            required_error: "description is required",
        }),
    }),
});
