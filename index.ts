import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

const user = {
  '0': { username: 'Nora', password: 'Nora123', posts: {} },
  '1': {
    username: 'May',
    password: 'May123',
    posts: {
      0: {
        content: 'this is my first post',
        likes: 5,
        comments: {}
      },
      1: {
        content: 'this is my second post',
        likes: 15,
        comments: {
          0: {
            content: 'great!'
          },
          1: {
            content: 'awesome'
          }
        }
      }
    }
  },
  '2': {
    username: 'Rex',
    password: 'Rex123',
    posts: {
      0: { content: 'Second user first post' },
      1: { content: 'Second user second post' }
    }
  }
};

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signup', (req: Request, res: Response) => {
  const { username: requestUserName, password: requestPassword } = req.body;

  user[Object.keys(user).length] = {
    username: requestUserName,
    password: requestPassword
  };

  console.log(user);

  res.send('User successfully signed up');
});

const checkUserId = (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.headers.userid;
  next();
};

app.post('/login', checkUserId, (req: Request, res: Response) => {
  const { username: requestUserName, password: requestPassword } = req.body;
  const userId = res.locals.user;

  user[userId].username === requestUserName &&
  user[userId].password === requestPassword
    ? res.send('user has successfully logged in')
    : res.send('user cannot log in');
});

app.post('/post', checkUserId, (req: Request, res: Response) => {
  /*  
    client is expected to send:
    {content: ""}
  */

  const postContent = req.body;
  const userPosts = user[res.locals.user].posts;

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
  const userPosts = user[res.locals.user].posts;

  userPosts[post.id] = {
    ...userPosts[post.id],
    content: post.content
  };
  console.log('userPosts', userPosts);
  res.send('Post updated successfully');
});

app.get('/view-post', checkUserId, (req: Request, res: Response) => {
  /*  
    client can send :
    {id:   which is the post id}  as query
  */
  const userPosts = user[res.locals.user].posts;

  req.query.id ? res.send(userPosts[req.query.id]) : res.send(userPosts);
});

app.delete('/delete-post', checkUserId, (req: Request, res: Response) => {
  /*
    client is expected to send 
    {id: post id be deleted}
  */
  const { id: postId } = req.body;
  const userPosts = user[res.locals.user].posts;

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

  const userPosts = user[res.locals.user].posts;

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
  const userPosts = user[res.locals.user].posts;

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
  const userPosts = user[res.locals.user].posts;

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
  const userPosts = user[res.locals.user].posts;

  delete userPosts[postId].comments[commentId];
  console.log('comment: ', userPosts[postId]);
  res.send('comment removed successfully');
});

app.get('/search-post', checkUserId, (req: Request, res: Response) => {
  const searchQuery = req.query.q;
  const userPosts = user[res.locals.user].posts;

  res.send(
    Object.values(userPosts).filter(item => item.content.includes(searchQuery))
  );
});

app.listen('5000', () => {
  console.log('⚡️[server]: Server is running at https://localhost:5000');
});
