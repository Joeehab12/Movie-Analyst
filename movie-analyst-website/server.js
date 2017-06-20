/**
 * Created by youss on 20-Jun-17.
 */
var express = require('express');
var request = require('superagent');
var bodyParser = require('body-parser');
var app = express();

app.set('view engine','ejs');
app.set('views',__dirname + '/public/views');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var non_interactive_client_id = '3XoaVBQA5OXX0KXRyMYxPD38Ruav03pK';
var non_interactive_client_secret = '0a5nNywEgSg2_T2JWcs-6rFN0Y3N-7fyCRe9f03lxS5o31wzk2BSDq9oKzKZB8A-';

var authData = {
    client_id: non_interactive_client_id,
    client_secret: non_interactive_client_secret,
    grant_type: 'client_credentials',
    audience: 'http://movieanalyst.com'
};

function getAccessToken(req,res,next){
    request.post('https://joehab12.auth0.com/oauth/token').send(authData).end(function(err,res){
        console.log(req.access_token);
        if(req.body.access_token){
            req.access_token = res.body.access_token;
            next();
        }
        else{
            res.send(401,'Unauthorized');
        }
    });
}

app.get('/', function(req, res,next){
    res.render('index');
    next();
});


app.get('/movies',getAccessToken, function(req,res){
    request
        .get('http://localhost:3000/movies')
        .set('Authorization','Bearer ' + req.access_token)
        .end(function(err,data){
            if(data.status == 403){
                res.send(403,'403 Forbidden');
            }
            else{
                var movies = data.body;
                res.render('movies',{movies: movies});
            }
        })
});



app.listen(3005);