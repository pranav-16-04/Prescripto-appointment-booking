import jwt from 'jsonwebtoken'

// User authentication middleware
const authUser = async(req,res,next)=>{
    try{
        const token = req.headers.token || req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        
        // Set user information in req.user instead of req.body
        req.user = { id: token_decode.id }

        next()
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export default authUser