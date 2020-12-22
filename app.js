//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_CONNECT_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model('Post', postSchema);

app.get("/", function(req, res){

  Post.find({}, (err, found)=>{
    if (err) {
      console.log("Error reaching database");
    } else {

      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: found
      });
    }
  });
});


app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render('contact', {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render('compose');
});

app.post("/compose", function(req, res){
  
  const newPost = new Post({
    title: _.startCase(_.toLower(req.body.title)),
    content: req.body.content
  });
  newPost.save();
  res.redirect('/');
}); 



app.get("/posts/:postTitle", function(req, res) {
  const reqTitle = _.startCase(_.toLower(req.params.postTitle));

  Post.findOne({title: reqTitle}, (err, found)=>{
    if (err) {
      console.log(err);
    } else {
      if (found == null) {
        res.status(404);
        res.render('404');
      } else {
        res.render('post', {post: found});
      }
    }
  });
});

// Handle 404
app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});