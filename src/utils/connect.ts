import mongoose from 'mongoose'
import config from 'config'



async function connect(){
const dbUri=config.get<string>('dbUrl')
try{
 await mongoose.connect(dbUri)
 .then(()=>console.log('connected to db')
 )
}catch(err){
       console.error('err in mongoose connect');
    process.exit(1)
}

}

export default connect