const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('images'));
app.use(express.static('public'));

const bodyParser = require('body-parser')
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({
  extended: true
}));


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vimal@9440942366',
    database: 'handyman'
});

con.connect();

app.get('/', (req, res)=>{

    res.render('home', {username});
});




let username="";
let password="";


app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname+"/html/login.html"));
});


app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname+"/html/register.html"));
});

app.post('/register', (req, res)=>{
    if(req.body.password1==req.body.password2) {

        let sql = `insert into users values(?,?)`;
        con.query(sql, [req.body.username, req.body.password1], (err, rows, fields)=>{
        });
        
        sql = `insert into userinfo values(?, ?, ?, ?, ?)`;
        con.query(sql, [req.body.username, req.body.fname, req.body.lname, req.body.address, req.body.phone], (err, rows, fields)=>{
        });

        sql = `insert into rating values(?, ?, ?)`;
        con.query(sql, [req.body.username, 0, 0], (err, rows, fields)=>{           
        });

        res.redirect('/login');
    }
    else
        console.log('mismatch in password');
});

app.post('/login', (req, res)=>{
    if(req.body.username && req.body.password) {
        username=req.body.username;
        password=req.body.password;
        let sql = `select pass from users where username = ?`;
        con.query(sql, [username], (err, rows, fields)=>{
            if(password == rows[0].pass){
                res.redirect('/home');
            }
            else {
                console.log('incorrect credentials... Try to login again!!');
            }
        });
    }
    else {
        res.redirect('/register');
    }
});

app.get('/profile', (req, res)=>{

    let sql = `select * from userinfo where username = ?`;
    con.query(sql, [username], (err, rows, fields)=>{
        if(!err) {
            let sql1 = `select * from rating where username = ?`;
            con.query(sql1, [username], (err, result, fields)=>{
                res.render('profile', {rows, result});
            });            
        }
    });
});


app.get('/home', (req, res)=>{
    res.render('home', {username});
})


app.get('/post', (req, res)=>{
    res.sendFile(path.join(__dirname+"/html/post.html"));
});


const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.post('/post', (req, res)=>{
    let fname = username + req.files.pic.name;
    let newPath = path.join(process.cwd(), 'images', fname);
    req.files.pic.mv(newPath);
    let id;
    let sql =  `select count(*) as id from posts where username = ?`;
    con.query(sql, [username], (err, rows, fields)=>{
        if(id == 0) id = 1;
        else id = rows[0].id+1;
        console.log(id);
    });

    sql = `insert into posts values(?, ?, ?, ?, ?, ?, ?)`;
    con.query(sql, [id, username, fname, req.body.price, req.body.category, req.body.about, req.body.address], (err, rows, fields)=>{
        console.log(id, username, fname, req.body.price, req.body.category, req.body.about, req.body.address);
    });

    res.redirect('/home');
    
});

app.get('/myposts', (req, res)=>{
    let sql = `select * from posts where username = ?`;
    con.query(sql,[username], (err, rows, fields)=>{
        res.render('posts', {rows});
    });    
});


let address="";
app.post('/getlocal', (req, res)=>{
    let sql = `select * from userinfo where username = ?`;
    con.query(sql, [username], (err, rows, fields)=>{
        address = rows[0].address;
    })
    sql = `select * from posts where address = ?`;    
    con.query(sql, [address], (err, locals, fields)=>{
        console.log(locals);
        res.render('home', {username, locals});
    });    
});

app.get('/top',(req, res)=>{
    con.query(`select * from rating order by stars`, (err, rows, fields)=>{
        res.render('home', {username, rows});
    });
});

app.get('/catalog', (req, res)=>{
    
    let sql = `select * from posts order by category`;
    con.query(sql, (err, posts, fields)=>{
        posts.forEach((cat)=>{
            console.log(cat.username, cat.rel_path);
        })
        res.render('home', {username, posts});
    });
});




app.listen(80);