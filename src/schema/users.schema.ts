import {object,string,TypeOf} from 'zod'

//create user schema

export const createUserSchema=object({
    body:object({
        name:string({
            required_error:"Name is required"
        }),
        password:string({
            required_error:"Password is required"
        }).min(6,'passwor too short -should be 6 chars minimum '),
        email:string({
            required_error:"Email is required",
        }).email('Not a valid email')
    })
})


//login

export const loginUserSchema = object({
    body: object({
      email: string({
        required_error: "Email is required",
      }),
      password: string({
        required_error: "Password is required",
      }),
    }),
  });