const mongoose = require('mongoose');

exports.clientPromise = mongoose
  .connect(
    'mongodb+srv://thomas:7kKookVjng8R99bE@cluster0.wnkhhb6.mongodb.net/chat?retryWrites=true&w=majority'
  )
  .then((client) => {
    console.log('Connected to MongoDB');
    return client;
  })
  .catch((err) => {
    console.log(err);
  });
