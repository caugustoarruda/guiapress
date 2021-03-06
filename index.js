const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');

// Import Models
const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./users/User');

// View engine
app.set('view engine', 'ejs');


// Session
app.use(session({
    secret: 'umasecretkeyforteaqui',
    cookie: {
        maxAge: 3000000000
    }
}));

// Bodry parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Static files
app.use(express.static('public'));


// Connection
connection.authenticate().then(() =>{
    console.log("Connected!")
}).catch((error) => {
    console.log(error)
});

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

app.get('/', (req, res)=> {
    Article.findAll().then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {
                articles: articles,
                categories: categories
            });
        })
    })
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {
                    article: article,
                    categories: categories
                });
            })
        }else {
            res.redirect('/')
        }
    })
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article
        }]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {
                    articles: category.articles,
                    categories: categories
                })
            })
        }else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/');
    })
});

app.listen(8080, () =>{
    console.log("App started")
});