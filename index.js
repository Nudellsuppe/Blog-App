import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const data = [];

// Post class
class Post {
  constructor(title, description, id, text, date, author) {
    this.title = title;
    this.description = description;
    this.id = id;
    this.text = text;
    this.date = date;
    this.author = author;
  }
}

// Sample data
const post1 = new Post(
  "my Title",
  "my Description",
  1,
  "Cum sociis natoque penatibus et magnis, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.",
  "January 1, 2014",
  "Mats"
);
const post2 = new Post(
  "my Title2",
  "my Description",
  2,
  "Cum sociis natoque penatibus et magnis, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.",
  "January 1, 2014",
  "Mats"
);
data.push(post1, post2);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.render("index.ejs", { data }));

app.get("/create", (req, res) => res.render("create.ejs", { data }));

app.post("/create", (req, res) => {
  const id = data.length + 1;
  const date = getCurrentDate();
  data.push(
    new Post(
      req.body.title,
      req.body.description,
      id,
      req.body.text,
      date,
      "Mats"
    )
  );
  res.redirect(`/posts/${id}`);
});

app.get("/posts/:postID", (req, res) => {
  const id = parseInt(req.params.postID, 10);
  const post = findPostById(id);
  if (post) {
    res.render("index.ejs", { data, post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/posts/delete/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  removePost(id);
  res.redirect("/");
});

app.get("/posts/edit/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = findPostById(id);
  if (post) {
    res.render("edit.ejs", { data, post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/posts/edit/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const postIndex = data.findIndex((post) => post.id === id);
  if (postIndex !== -1) {
    data[postIndex].title = req.body.title;
    data[postIndex].description = req.body.description;
    data[postIndex].text = req.body.text;
    res.redirect(`/posts/${id}`);
  } else {
    res.status(404).send("Post not found");
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

// Helper functions
function getCurrentDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function removePost(id) {
  const indexOfPost = data.findIndex((post) => post.id === id);
  if (indexOfPost !== -1) {
    data.splice(indexOfPost, 1);
  }
}

function findPostById(id) {
  return data.find((post) => post.id === id);
}
