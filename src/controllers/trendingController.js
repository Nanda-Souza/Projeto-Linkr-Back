import {
    getTopTrends
  } from "../repositories/trendingRepository.js";

export async function listTopTrends(req, res) {
    try {
      const result = await getTopTrends();
      return res.status(200).send(result.rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }