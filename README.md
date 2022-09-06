Express with Typescript starter explained (fast)

If you are reading this, I think you should know Typescript & Express, so let's go through this, and build something from scratch !

Before start
Let's start by checking if node is currently installed
node -v
Install typescript (globally) if not installed

npm install -g typescript

Initialization
So let's begin ! First of all, use npm init in order to create package.json !

So basically what are we needing ? We need to install express, install and configure typescript packages, and install @types package linked to the previous packages. We also need to install ts-node in order to build typescript file in nodejs

So let's do this
npm i express
npm i -D typescript ts-node @types/node @types/express
Init config typescript
tsc --init
Create two folders:

src/ (will contains all ts files)

dist/ (will contains all builded files (js files))

Start
In order to start our project, we will use nodemon in order to watch any changes in \*.ts files and re-build it automatically.
npm i -D nodemon
Create command to execute code
"scripts": {
"dev": "nodemon src/app.ts"
},
Create app.ts file in src/ like bellow :
import express, { Application, Request, Response } from 'express'

const app: Application = express()

const port: number = 3001

app.get('/toto', (req: Request, res: Response) => {
res.send('Hello toto')
})

app.listen(port, function () {
console.log(`App is listening on port ${port} !`)
})
Run server
npm run dev
Yeah it's working ! You can now create your beautiful project in Express supporting Typescript !
