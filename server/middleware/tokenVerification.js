const jwt = require("jsonwebtoken")

function tokenVerification(req,res,next){
    //pobranie tokenu z naglowka
    let token = req.headers["x-access-token"]
    if(!token){
        res.status(403).send({message: "No token procided!"})
    }
    //jesli przeslano token - weryfikacja jego poprawnosci:
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err,decodeduser)=>{
        if(err){
            console.log("Unauthorized!")
            res.status(401).send({message: "Unauthorized!"})
        }
        console.log("Token poprawny, uzytkownik: "+decodeduser._id)
        req.user = decodeduser
        next()
    })
}
module.exports = tokenVerification
