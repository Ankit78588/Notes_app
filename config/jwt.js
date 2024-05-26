const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;


// generateToken
const generateToken = function(payload){
    const token = jwt.sign(payload, secret);
    return token;
};


// verifyToken
const verifyTokenMiddleware = function(req, res, next){
    const token = req.cookies.token;
    if(!token) return res.render('Homepage');
    
    try{
        const decoded = jwt.verify(token, secret);
        req.userPayload = decoded,
        next();
    }catch(err){
        // return next(err);
        res.status(401).json({ error: 'Session Expired. Please Login again.' });
    }
}



module.exports = {generateToken,verifyTokenMiddleware};




