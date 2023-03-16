import { getIdByToken } from "../repositories/likesRepository.js";
import { searchUser } from "../repositories/userRepository.js";

export async function searchUserByName(req, res){
    const search = req.query.search   
    try {
        const result = await searchUser(search)
        console.log(result)
        return res.status(200).send(result);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}