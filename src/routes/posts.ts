import express, { Request, Response } from 'express';
import { checkToken } from '../middleware/checkJwt';
import { user } from '../db';
import CommentRoutes from './comment';

const app = express.Router();

app.use(checkToken);
app.use('/comment', CommentRoutes);

app.post('/', (req: Request, res: Response) => {
  /*  
    client is expected to send:
    {content: ""}
  */

  const postContent = req.body;

  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

  userPosts[Object.values(userPosts).length] = {
    content: postContent,
    likes: 0,
    comments: {}
  };
  console.log(userPosts);
  res.send('Post created successfully');
});

app.patch('/update', (req: Request, res: Response) => {
  /*  
    client is expected to send:
    {id:   which is the post id
      content: post content to be updated
     } 
  */

  const post = req.body;

  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

  userPosts[post.id] = {
    ...userPosts[post.id],
    content: post.content
  };
  console.log('userPosts', userPosts);
  res.send('Post updated successfully');
});

app.get('/view', (req: Request, res: Response) => {
  console.log('req.params: ', req.params);
  /*  
    client can send :
    {id:   which is the post id}  as query
  */
  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

  res.send(userPosts);
});

app.get('/view/:postId', (req: Request, res: Response) => {
  console.log('req.params: ', req.params);
  /*  
    client can send :
    {id:   which is the post id}  as query
  */
  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

  res.send(userPosts[req.params.postId]);
});

app.delete('/delete', (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be deleted}
  */
  const { id: postId } = req.body;

  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

  delete userPosts[postId];

  console.log('userPosts', userPosts);
  res.send('post deleted successfully!');
});

app.patch('/like', (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be deleted}
  */
  const { id: postId } = req.body;

  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

  userPosts[postId] = {
    ...userPosts[postId],
    likes: userPosts[postId].likes + 1
  };
  console.log('userPosts: ', userPosts);
  res.send('post liked successfully');
});

app.patch('/unlike', (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be deleted}
  */
  const { id: postId } = req.body;

  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

  userPosts[postId] = {
    ...userPosts[postId],
    likes: userPosts[postId].likes - 1
  };
  console.log('userPosts: ', userPosts);
  res.send('post unliked successfully');
});

app.get('/search', (req: Request, res: Response) => {
  const searchQuery = req.query.q;

  const userPosts = Object.values(user).find(
    user => user.username === req.user
  ).posts;

  res.send(
    Object.values(userPosts).filter(item => item.content.includes(searchQuery))
  );
});

export default app;
