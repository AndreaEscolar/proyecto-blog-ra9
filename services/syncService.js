const axios = require("axios");

const userRepo = require("../models/userRepo");
const postRepo = require("../models/postRepo");
const commentRepo = require("../models/commentRepo");

async function syncAll() {
  const client = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 8000,
  });

  // Descarga en paralelo
  const [usersRes, postsRes, commentsRes] = await Promise.all([
    client.get("/users"),
    client.get("/posts"),
    client.get("/comments"),
  ]);

  const users = usersRes.data;
  const posts = postsRes.data;
  const comments = commentsRes.data;

  // Inserta en orden por FKs
  userRepo.upsertMany(users);
  postRepo.upsertMany(posts);
  commentRepo.upsertMany(comments);

  return {
    syncedUsers: users.length,
    syncedPosts: posts.length,
    syncedComments: comments.length,
  };
}

module.exports = { syncAll };