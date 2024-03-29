const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('home')
})

//inserindo dados no banco de dados
app.post('/books/insertbook', (req, res) => {
  
  const title = req.body.title
  const pageqty = req.body.pageqty

  const sql = `INSERT INTO books (title, pageqty) VALUES ('${title}', '${pageqty}')`

  conn.query(sql, function(err) {
    if(err){
      console.log(err)
    }

    res.redirect('/books')
  })
})
//------------------------------------------------



app.get('/books', (req, res) => {
  const sql = "SELECT * FROM books"
  
  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err)
      return
    }

    const books = data

    console.log(books)

    res.render('books', {books} )
  })
})

app.get('/books/:id', (req, res) =>{
  const id = req.params.id

  const sql = `SELECT * FROM books WHERE id = ${id}`

  conn.query(sql, function(err, data) {
    if(err){
      console.log(err)
    }

    const book = data[0]

    res.render('book', {book})
  })
})

app.get('/books/edit/:id', (req, res) => {
  const id = req.params.id

  const sql = `SELECT * FROM books WHERE id = ${id}`

  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err)
      return
    }

    const book = data[0]

    res.render('editbook', {book})
})

})

app.post('/books/updatebook', (req, res) => {

  const id = req.body.id
  const title = req.body.title
  const pageqty = req.body.pageqty

  const sql = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`

  conn.query(sql, function(err){
    if(err){
      console.log(err)
      return
    }

    res.redirect('/books')
  })
})

app.post('/books/remove/:id', (req, res) => {
  
  const id = req.params.id

  const sql = `DELETE FROM books WHERE id = ${id}`

  conn.query(sql, function(err){
    if(err){
      console.log(err)
      return
    }

    res.redirect('/books')
  })
})

//Podemos evitar as linhas de codigo a seguir, com um db para se conectar ao banco de dados, criando
//um novo repositorio chamadd db, e utilizando o seguinte codigo 

//com esse codigo n é necessario conectar com o conn no codigo do index.js
// const mysql = require('mysql')

// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host:'localhost',
//   user:'root',
//   password:'',
//   database: 'nodemysql'
// })

// module.exports = pool

//conecta a databse do banco de dados
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql',
})
//--------------------------------------------------
conn.connect(function(err) {
  if(err){
    console.log(err)
  }
  console.log('Conectado ao MySQL')

  app.listen(3000)

})