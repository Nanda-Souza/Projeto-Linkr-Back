import db from "../config/database.js";

export async function validateToken(req, res, next){
    const { authorization } = req.headers;
    if(!authorization){
        return res.sendStatus(401)
    }
    const token = authorization?.replace('Bearer ', '');
    try{
        const session = await db.query(`SELECT * FROM sessions WHERE token=$1`,[token]);
        
        if(!session.rows[0]){
            return res.sendStatus(401)
        }
    }catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
    res.locals.token = token;
    next()
}