const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: String,
});

module.exports = PostSchema;

// this is just a schema, we didnt create a model
// we are embedding posts inside user models
// as a sub document