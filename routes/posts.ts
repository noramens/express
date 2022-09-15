import express, { Request, Response } from 'express';
import { checkUserId } from '../middleware/checkUser';
import { user } from '../db';

const app = express.Router();

app.post('/', checkUserId, (req: Request, res: Response) => {
  /*  
    client is expected to send:
    {content: ""}
  */

  const postContent = req.body;
  const userPosts = user[res.user].posts;

  userPosts[Object.values(userPosts).length] = {
    content: postContent,
    likes: 0,
    comments: {}
  };
  console.log(userPosts);
  res.send('Post created successfully');
});

app.patch('/update-post', checkUserId, (req: Request, res: Response) => {
  /*  
    client is expected to send:
    {id:   which is the post id
      content: post content to be updated
     } 
  */

  const post = req.body;
  const userPosts = user[res.user].posts;

  userPosts[post.id] = {
    ...userPosts[post.id],
    content: post.content
  };
  console.log('userPosts', userPosts);
  res.send('Post updated successfully');
});

app.get('/view-post/:postId', checkUserId, (req: Request, res: Response) => {
  console.log('req.params: ', req.params);
  /*  
    client can send :
    {id:   which is the post id}  as query
  */
  const userPosts = user[res.user].posts;

  req.params ? res.send(userPosts[req.params.postId]) : res.send(userPosts);
});

app.delete('/delete-post', checkUserId, (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be deleted}
  */
  const { id: postId } = req.body;
  const userPosts = user[res.user].posts;

  delete userPosts[postId];

  console.log('userPosts', userPosts);
  res.send('post deleted successfully!');
});

app.patch('/like-post', checkUserId, (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be deleted}
  */
  const { id: postId } = req.body;

  const userPosts = user[res.user].posts;

  userPosts[postId] = {
    ...userPosts[postId],
    likes: userPosts[postId].likes + 1
  };
  console.log('userPosts: ', userPosts);
  res.send('post liked successfully');
});

app.patch('/unlike-post', checkUserId, (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be deleted}
  */
  const { id: postId } = req.body;
  const userPosts = user[res.user].posts;

  userPosts[postId] = {
    ...userPosts[postId],
    likes: userPosts[postId].likes - 1
  };
  console.log('userPosts: ', userPosts);
  res.send('post unliked successfully');
});

app.post('/comment', checkUserId, (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be deleted,
      content: post content}
  */

  const { id: postId, content: postContent } = req.body;
  const userPosts = user[res.user].posts;

  userPosts[postId] = {
    ...userPosts[postId],
    comments: {
      ...userPosts[postId].comments,
      [Object.keys(userPosts[postId].comments).length + 1]: postContent
    }
  };
  console.log('userPosts: ', userPosts);
  res.send('comment added successfully');
});

app.delete('/delete-comment', checkUserId, (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be deleted,
      comment: {
        id: comment id
      }
    }
  */

  const {
    id: postId,
    comment: { id: commentId }
  } = req.body;
  const userPosts = user[res.user].posts;

  delete userPosts[postId].comments[commentId];
  console.log('comment: ', userPosts[postId]);
  res.send('comment removed successfully');
});

app.get('/search-post', checkUserId, (req: Request, res: Response) => {
  const searchQuery = req.query.q;
  const userPosts = user[res.user].posts;

  res.send(
    Object.values(userPosts).filter(item => item.content.includes(searchQuery))
  );
});

export default app;
