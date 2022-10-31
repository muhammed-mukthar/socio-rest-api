
import { omit } from "lodash";
import UserModel, { UserInput } from "../models/user.model";



export async function createUser(input:UserInput) {
    try{
        console.log('input',input);
        
const user=await UserModel.create(input)
console.log('user creating',user);

    return omit(user.toJSON(),'password')
    }catch(err:any){
        console.log('err',err);
        
return (err)
    }
    
}