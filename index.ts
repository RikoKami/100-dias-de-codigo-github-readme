import express from "express";
import mustacheExpress from "mustache-express";

const app = express();

app.set("views", `${__dirname}/views`);
app.set("view engine", "mustache");
app.engine("mustache", mustacheExpress());

app.get("/", async (req, res) => {
  const username = req.query.username;

  console.log({ username });

  if (typeof username !== "string" || !username) {
    return res.status(400).send("Username not specified");
  }

  try {
    const url = new URL(`http://20.201.112.54:8001/api/users/find/${username}`);
    const response = await fetch(url).then((data) => data.json());

    console.log({ response });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    res.setHeader("content-type", "image/svg+xml; charset=utf-8");
    res.setHeader("cache-control", "no-cache, max-age=0");

    res.render("index", {
      finishedDays: response.days_participated || 0,
      daysFinishedPercentage: response.days_participated
        ? (response.days_participated || 0) * 250
        : 0,
      name: response.name || "",
      totalLikes: response.statistics?.total_likes || 0,
      totalViews: response.statistics?.total_views || 0,
      totalReplies: response.statistics?.total_replies || 0,
      maxStreak: response.statistics?.max_streak || 0,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.NODE_ENV || 3000;

app.listen(port, () => console.log(`Server running on ${port}`));
