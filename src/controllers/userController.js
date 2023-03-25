import { getIdByToken } from "../repositories/likesRepository.js";
import { followUser, searchFollower, searchUser, unfollowUser, isFollowing } from "../repositories/userRepository.js";

export async function searchUserByName(req, res){
    const search = req.query.search   
    const token = res.locals.token;
    const userId = await getIdByToken(token)
    try {
        const result = await searchUser(search, userId.user_id)
        return res.status(200).send(result);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}

export async function followUserById(req, res){
    const { id } = req.params
    const token = res.locals.token;
    const userId = await getIdByToken(token)
    
    try {
       await followUser(userId.user_id, id)
        return res.sendStatus(200)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function unfollowUserById(req, res){
    const { id } = req.params
    const token = res.locals.token;
    const userId = await getIdByToken(token)
    
    try {
       await unfollowUser(userId.user_id, id)
        return res.sendStatus(200)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function searchFollowerById(req, res){
    const { id } = req.params
    const token = res.locals.token;
    const userId = await getIdByToken(token)
    try {
        const result = await searchFollower(userId.user_id, id)
        return res.status(200).send(result.rows[0])
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

}

export async function checkFollow(req, res){    
    const token = res.locals.token;
    const userId = await getIdByToken(token)
    try {
        const result = await isFollowing(userId.user_id)
        
        if(result.rows[0].count > 0){
            return res.status(200).send(true)
        } else{
            return res.status(200).send(false)
        }
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

}