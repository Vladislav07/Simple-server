const express = require("express");
const app = express();
const read = require("node-readability");
const bodyParser = require("body-parser");
const Article = require("./db").Article;

app.set("port", process.env.port || 3000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use('/css/bootstrap.css',
//express.static('node_modules/bootstrap/dist/css/bootstrap.css'));
app.get("/articles", (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err);
    res.format({
      html: () => {
        res.render("articles.ejs", { articles: articles },{async: true});
      },
      json: () => {
        res.send(articles);
      },
    });
  });
});
app.post("/articles", (req, res, next) => {
  const url = req.body.url;
  read(url, (err, result) => {
    if (err || !result) res.status(500).send("Error downloading article");
    Article.create(
      {title: result.title, content: result.content },
      (err, article) => {
        if (err) return next(err);
        res.send("OK");
      }
    );
  });
});
app.get("/articles/:id", (req, res, next) => {
  const id = req.params.id;
  Article.find(id, (err, article) => {
    if (err) return next(err);

    res.format({
      html: () => {
        res.render("article.ejs", { article: article });
      },
      json: () => {
        res.send(article);
      },
    });
  });
});
app.delete("/articles/:id", (req, res, next) => {
  const id = req.params.id;
  Article.delete(id, (err) => {
    if (err) return next(err);
    res.send({ message: "Deleting" });
  });
});
app.listen(app.get("port"), () => {
  console.log("Exspess web app available at localhost:", app.get("port"));
});
module.exports = app;
