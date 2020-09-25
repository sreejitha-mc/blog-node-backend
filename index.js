const express = require('express')
var mysql = require('mysql');
const app = express()
const port = 4000;
var cors = require('cors');

app.use(cors())

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "thunderbird",
    database: "blog"
});

con.connect(function (err) {
    if (err) throw err;
});


app.get('/articles', (req, res) => {
    con.query("SELECT * FROM articles ORDER BY date DESC limit 5", function (err, result) {
        if (err) throw err;
        res.json(result);
    });

});

app.get('/article', (req, res) => {

    if (req.query.id) {
        var qry = "SELECT * FROM `articles` WHERE id = " + parseInt(req.query.id);
        con.query(qry, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    }

});

app.get('/comment', (req, res) => {

    if (req.query.article_id) {
        var qry = `SELECT id,user,comment,date FROM comment WHERE article_id = ${parseInt(req.query.article_id)} and parent_id IS NULL`;
        con.query(qry, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    }

});

app.get('/get-replys', (req, res) => {

    if (req.query.parent_id) {
        var qry = "SELECT id,user,comment,date FROM `comment` WHERE parent_id = " + parseInt(req.query.parent_id);
        con.query(qry, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    }

});

app.post('/comment', (req, res) => {
    if (req.query.user && req.query.article_id && req.query.comment && (!req.query.parent_id || req.query.parent_id == '')) {
        var qry = `INSERT INTO comment SET user = '${req.query.user}', article_id = ` + parseInt(req.query.article_id) + `,comment = '${req.query.comment}',parent_id = NULL`;
        con.query(qry, function (err, result) {
            if (err) throw err;
            res.json('succes');
        });
    } else if (req.query.user && req.query.article_id && req.query.comment) {
        var qry = `INSERT INTO comment SET user = '${req.query.user}', article_id = ` + parseInt(req.query.article_id) + `,comment = '${req.query.comment}',parent_id = ` + parseInt(req.query.parent_id);
        con.query(qry, function (err, result) {
            if (err) throw err;
            res.json('succes');
        });
    }

});

app.post('/createArticle', (req, res) => {
    if (req.query.title && req.query.body) {
        var qry = `INSERT INTO articles SET title = '${req.query.title}',body = '${req.query.body}'`;
        con.query(qry, function (err, result) {
            if (err) throw err;
            res.json('succes');
        });

    }

});

app.put('/editArticle', (req, res) => {
    if (req.query.title && req.query.body && req.query.article_id) {
        var qry = `UPDATE articles SET title = '${req.query.title}',body = '${req.query.body}' WHERE id = '${req.query.article_id}'`;
        con.query(qry, function (err, result) {
            if (err) throw err;
            res.json('succes');
        });

    }

});

app.delete('/deleteArticle', (req, res) => {
    if (req.query.article_id) {
        var qry = `DELETE FROM articles WHERE id = '${req.query.article_id}'`;
        con.query(qry, function (err, result) {
            if (err) throw err;
            res.json('succes');
        });

    }

});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});