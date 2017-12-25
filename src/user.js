const mongoose = require('mongoose');
const PostSchema = require('./post');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message:  'Name must be longer than 2 characters'
    },
    required: [true, 'Name is required.'],
  },
  posts: [PostSchema],
  likes: Number,
  blogPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'blogPost',
  }],
}, { usePushEach: true });

// virtual prop
// we use es5 fxn on purpose here, instead of arrow fxn
// because we used 'this'
// if we used arrow, this would refer to the file
// es5 fxn refers to the user model
UserSchema.virtual('postCount').get(function() {
  return this.posts.length;
})
// above we used a 'getter'

// middleware
UserSchema.pre('remove', function(next) {
  // this === joe/created user || this is why we can't use arrow fxn
  // use below line instead of call at top
  // so we don't have a model reliant on another, all the time
  // aka 'cyclical' loading issue
  const BlogPost = mongoose.model('blogPost');
  // check all blogPost id's and remove the ones
  // that are in this.blogPosts
  BlogPost.remove({ _id: { $in: this.blogPosts } })
    .then(() => next());
});
// 'next()' is used to go to next middleware or process


const User = mongoose.model('user', UserSchema);

module.exports = User;


// posts is an array of sub-docs

//  IMPORTANT: use `usePushEach: true` so we can
//  use push() when modifying