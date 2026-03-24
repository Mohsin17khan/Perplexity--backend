import JWT from 'jsonwebtoken'


export function authMiddle(req,res,next){
    const token = req.cookies.token

    // if(!token){
    //     return res.status(400).json({
    //         message:"Invalid Token"
    //     })
    // }

     // fallback to Authorization header (for iOS Safari)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    
    let decode = null
    try {
        decode = JWT.verify(token, process.env.TOKEN_SECRET);
        req.user = decode
    } catch (error) {
        return res.status(401).json({
            message:"Unauthorized",
            success: false,
            err:"Invalid Token"
        })
    }

    next()
}