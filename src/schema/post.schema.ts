import { object, string } from "zod";

export const createPostSchema = object({
  body: object({
    desc: string({
      required_error: "description is required",
    }),
  }),
});


