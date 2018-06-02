const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const {mongoose} = require('./../models/mongoose');
const {Post} = require('./../models/posts');
const moment = require('moment');

var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname,'..','public');
app.use(express.static(publicPath));

let connections = 0;
let npost = 0;

io.on('connection', (socket)=>{
  connections++;
  console.log(`New Connection. Now connected: ${connections}`);

  Post.find({},(err,docs)=>{
    if(!err){
      npost = docs.length;
      for(i=0;i<npost;i++){
        docs[i].postedAt = moment(docs[i].postedAt).fromNow();
      }
      socket.emit('loadPosts', docs);
    } else {
      console.log('Error fetching previous posts.');
    }
  });

  socket.on('newPost',(post)=>{
    npost++;
    let body = {
      message: post.message,
      postedAt: moment().format('YYYY-MM-DD hh:mm:ss'),
      postNumber: npost
    };
    let postVar = new Post(body);
    postVar.save().then(()=>{
      console.log('Post Saved!');
      body.postedAt = moment(body.postedAt).fromNow();
      io.emit('addPost', body);
    }).catch((e)=>{
      console.log('Error saving the post');
    });
  });

  socket.on('disconnect',()=>{
    connections--;
    console.log(`Disconnect. Now connected: ${connections}`);
  });
});

app.get('/show',(req,res)=>{
  Post.find({postNumber: req.query.no},(err,found)=>{
    if(!err){
      res.send(found);
    } else{
      res.send('Post does not exist');
    }
  });
});

app.get('/delete',(req,res)=>{
  if(req.query.mode == 'all'){
    Post.remove({},(err,deleted)=>{
      if(!err){
        res.send('All posts deleted, Abhinav!');
      }
    });
  }
});

server.listen(port, ()=>{
  console.log('Server running at port ',port);
});
