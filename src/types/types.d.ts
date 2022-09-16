declare namespace Express {
  export interface Request {
    user: any;
    refreshToken: any;
    token: string;
    content: any;
  }
  export interface Response {
    user: any;
    refreshToken: any;
    content: any;
  }
}
