import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  database: "permalist",
  password: "Santhosh@123",
  host: "localhost",
  port: "5432"
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC")
    items = result.rows
    console.log(items);
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async (req, res) => {
  try {
    const addItem = req.body.newItem;
    await db.query("INSERT INTO items (title) VALUES ($1);", [addItem]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.post("/edit", async (req, res) => {
  try {
    const updateId = req.body.updatedItemId;
    const updateTitle = req.body.updatedItemTitle;
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2);", [updateTitle, updateId]);
    res.redirect("/")
  } catch (error) {
    console.error(error);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const deleteItem = req.body.deleteItemId
    await db.query("DELETE FROM items WHERE id = ($1)", [deleteItem]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
