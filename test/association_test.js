const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  let joe, blogPost, comment;
  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep, it really is'});
    comment = new Comment({ content: 'Congrats on great post' });

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;
    // use Promise.all to use an array to create one .then()
    Promise.all([ joe.save(), blogPost.save(), comment.save() ])
      .then(() => done());
  });

  // 'it.only' lets us run only this test [we used 'it']
  // useful for large amounts of tests

  it('saves a realation between a user and a blogpost', (done) => {
    User.findOne({ name: 'Joe' })
      .populate("blogPosts")
      .then((user) => {
        assert(user.blogPosts[0].title === 'JS is Great')
        done();
      });
  });
  // populate can also take config obj
  // here we can chain populate off of what we populate
  it('saves a full relation graph', (done) => {
      User.findOne({ name: 'Joe' })
        .populate({
          path: 'blogPosts',
          populate: {
            path: 'comments',
            model: 'comment',
            populate: {
              path: 'user',
              moddel: 'user'
            }
          }
        })
        .then((user) => {

          assert(user.name === 'Joe');
          assert(user.blogPosts[0].title === 'JS is Great');
          assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
          assert(user.blogPosts[0].comments[0].user.name === 'Joe');

          done();
        })
  });

});