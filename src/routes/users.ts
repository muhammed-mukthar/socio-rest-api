import express,{Request,Response} from 'express'

const router=express.Router()


/* ------------------------------- update user ------------------------------ */

router.put(':/id',async(req:Request,res:Response)=>{
if(req.body.userId ===req.params.id || res.locals.user.id){
if(req.body.password){
  
}
}else{
    return res.status(403).json('you can only update your account')
}
})
/* ------------------------------- delete user ------------------------------ */

/* ------------------------------- get a user ------------------------------- */

/* ------------------------------ follow a user ----------------------------- */

/* ----------------------------- unfollow a user ---------------------------- */

export default router