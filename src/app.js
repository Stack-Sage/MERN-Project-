import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use((cors({
   origin:process.env.CORS_ORIGIN, 
   credentials :true,
})))

app.use(express.json({limit:"20kb"})) 
app.use(express.urlencoded({limit:'20kb'}))
app.use(express.static("public"))

app.use(cookieParser())   


import { userRouter } from './routes/user.routes.js'
import { dashboardRouter } from './routes/dashboard.routes.js'
import { videoRouter } from './routes/video.routes.js'
import { playlistRouter } from './routes/playlist.routes.js'
import { likeRouter } from './routes/like.routes.js'
import { commentRouter } from './routes/comment.routes.js'
import { subscriptionRouter } from './routes/subscription.routes.js'
import { hotTakeRouter } from './routes/hotTake.routes.js'

   


app.use("/api/v1/users",userRouter)

app.use("/api/v1/takes",hotTakeRouter)

app.use("/api/v1/subscriptions",subscriptionRouter)

app.use("/api/v1/videos",videoRouter)

app.use("/api/v1/comments",commentRouter)

app.use("/api/v1/likes",likeRouter)

app.use("/api/v1/playlist",playlistRouter)

app.use("/api/v1/dashboard",dashboardRouter)

export default app 