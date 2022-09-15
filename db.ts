export const user = {
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
