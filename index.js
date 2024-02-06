import express from "express";
import fetch from "node-fetch";
import redis from "redis";

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient();

const app = express();

function setRes(username, repos) {
  return `<h2>${username} has ${repos} Github repos</h2>`;
}

async function getRepos(req, res, next) {
  try {
    console.log("Fetching data");

    const { username } = req.params;

    const response = await fetch(`https://api.github.com/users/${username}`);

    const jsonRes = await response.json();

    const repos = data.public_repos;

    await client.set(username, 3600, repos);

    res.send(setRes(username, repos));
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

async function cache(req, res, next) {
  const { username } = req.params;

  await client.get(username, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(setRes(username, data));
    } else {
      next();
    }
  });
}

app.get("/repos/:username", cache, getRepos);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
