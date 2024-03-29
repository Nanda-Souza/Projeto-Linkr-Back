import db from "../config/database.js";
export async function postLike(userId, postId) {
  const result = await db.query(
    `
          INSERT INTO likes (user_id, post_id) VALUES($1, $2)
       `,
    [userId, postId]
  );

  return result;
}

export async function getIdByToken(token) {
  const result = await db.query(
    `
            SELECT user_id FROM sessions
            WHERE token = $1
            `,
    [token]
  );

  return result.rows[0];
}

export async function postDeslike(userId, postId) {
  await db.query(
    `
          DELETE FROM likes WHERE user_id = $1 AND post_id = $2
       `,
    [userId, postId]
  );

  return;
}

export async function getLikeInfo(postIds, userId) {
  const result = await db.query(
    `SELECT 
         p.id AS post_id, 
         COALESCE(COUNT(l.*), 0) AS total_likes, 
         (
           SELECT COALESCE(array_agg(u.name), ARRAY[]::varchar[])
           FROM likes l2
           JOIN users u ON u.id = l2.user_id
           WHERE l2.post_id = p.id
           OFFSET 0
           LIMIT 3
         ) AS users_liked, 
         bool_or(l.user_id = $1) AS has_liked
       FROM 
         posts p
         LEFT JOIN likes l ON p.id = l.post_id
       WHERE 
         p.id = ANY($2::int[])
       GROUP BY 
         p.id;
      `,
    [userId.user_id, postIds]
  );

  const likeInfoDict = {};
  result.rows.forEach((row) => {
    likeInfoDict[row.post_id] = row;
  });

  const likeInfoArr = postIds.map((postId) => {
    return likeInfoDict[postId];
  });

  return likeInfoArr;
}

export async function deletePostLikes(postId) {
  await db.query(
    `
          DELETE FROM likes WHERE post_id = $1
       `,
    [postId]
  );

  return;
}

export async function getNumberOfComments(postIds) {
  if (postIds.length === 0) {
    return [];
  }

  const result = await db.query(
    `
    SELECT 
      post_id,
      COUNT(*) AS comment_count
    FROM comments
    WHERE post_id IN (${postIds.join(",")})
    GROUP BY post_id;
    `
  );

  const commentCounts = [];
  postIds.forEach((postId) => {
    const row = result.rows.find((row) => row.post_id === postId);
    commentCounts.push(row ? row.comment_count : 0);
  });

  return commentCounts;
}

export async function getNumberOfReposts(postIds) {
  if (postIds.length === 0) {
    return [];
  }

  const result = await db.query(
    `
    SELECT 
    original_post_id,
      COUNT(*) AS repost_count
    FROM posts
    WHERE original_post_id IN (${postIds.join(",")})
    GROUP BY original_post_id;
    `
  );

  const repostCounts = [];
  postIds.forEach((postId) => {
    const row = result.rows.find((row) => row.original_post_id === postId);
    repostCounts.push(row ? row.repost_count : 0);
  });

  return repostCounts;
}

export async function commentPost(userId, postId, comment) {
  const result = await db.query(
    `
          INSERT INTO comments (user_id, post_id, comment) VALUES($1, $2, $3)
       `,
    [userId, postId, comment]
  );

  return result;
}

export async function getComments(postId, token) {
  const sessionResult = await db.query(
    `
      SELECT user_id
      FROM sessions
      WHERE token = $1
    `,
    [token]
  );
  const userId = sessionResult.rows[0].user_id;

  const postResult = await db.query(
    `
      SELECT user_id
      FROM posts
      WHERE id = $1
    `,
    [postId]
  );
  const postAuthorId = postResult.rows[0].user_id;

  const followsResult = await db.query(
    `
      SELECT follow_id
      FROM follows
      WHERE user_id = $1
    `,
    [userId]
  );
  const followedIds = followsResult.rows.map((row) => row.follow_id);

  const result = await db.query(
    `
      SELECT users.name, users.img_url, comments.comment, comments.user_id
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = $1
      ORDER BY comments.id ASC
    `,
    [postId]
  );

  const comments = result.rows.map((row) => {
    const commentAuthorId = row.user_id;
    let status = "";
    if (commentAuthorId === postAuthorId) {
      status = `• post's author`;
    } else if (followedIds.includes(commentAuthorId)) {
      status = `• following`;
    }
    return {
      ...row,
      status,
    };
  });

  return comments;
}

export async function deletePostComments(postId) {
  await db.query(
    `
          DELETE FROM comments WHERE post_id = $1
       `,
    [postId]
  );

  return;
}
