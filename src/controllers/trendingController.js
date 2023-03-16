import {
    getTopTrends,
    getPostTrends
  } from "../repositories/trendingRepository.js";
import { getIdByToken } from "../repositories/likesRepository.js";

export async function listTopTrends(req, res) {
    try {
      const result = await getTopTrends();
      return res.status(200).send(result.rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }

  export async function listPostTrends(req, res) {  
  const { trendName } = req.body;
  const token = res.locals.token;
  const userId = await getIdByToken(token);
  
  try {
    const result = await getPostTrends(trendName, userId);
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}