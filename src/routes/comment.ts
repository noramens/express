import express, { Request, Response } from 'express';
import { user } from '../db';

const app = express.Router();

app.post('/', (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be commented,
      content: post content}
  */

  const { id: postId, content: postContent } = req.body;
  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

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

app.delete('/delete', (req: Request, res: Response) => {
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

  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

  delete userPosts[postId].comments[commentId];
  console.log('comment: ', userPosts[postId]);
  res.send('comment removed successfully');
});

export default app;
