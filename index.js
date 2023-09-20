const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')

const BooksSchema = require('./models/Books')

mongoose.connect("mongodb://127.0.0.1:27017/library")

const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection Error..."))
db.once("open", () => {
    console.log("Connection Successfull!!")
})

const app = express()

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// ----------------------------------APIs----------------------------------

// Show all books
app.get("/", async (req, res) => {
    const data = await BooksSchema.find({});
    res.render("home", { data: data })
})

// Load form to create new book
app.get('/add', (req, res) => {
    res.render('add_book')
})

// Load form to update a book
app.get('/update/:id', async (req, res) => {
    try {
        var data = await BooksSchema.findById(req.params.id)
        res.render('update_book', { data })
    } catch {
        res.send("Error!")
    }
})

// Get book by ID
app.get("/:id", async (req, res) => {
    try {
        const data = await BooksSchema.findById(req.params.id)
        res.render("show_one", { data: data })
    } catch {
        res.render("error", { reason: "Cannot find book!" })
    }
})

// Create new book
app.post("/", async (req, res) => {
    var book = new BooksSchema(req.body)
    await book.save().then((val) => {
        res.redirect(`/${val._id}`)
    }, (reason) => {
        res.render("error", { reason })
    })
})

// Update book
app.put('/:id', async (req, res) => {
    try {
        await BooksSchema.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/${req.params.id}`)
    } catch {
        res.send("Error")
    }
})

// Delete a book
app.delete("/:id", async (req, res) => {
    try {
        await BooksSchema.findByIdAndDelete(req.params.id)
        res.redirect("/")
    } catch {
        res.send("Book not found!")
    }
})

app.listen(3000, () => {
    console.log("Listening!")
})