import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlayList, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const playlistRouter = Router()

playlistRouter.use(verifyJWT)

playlistRouter.route("/create-playlist").post(createPlaylist)


playlistRouter.route("/:playlistId").get(getPlaylistById).patch(updatePlaylist).delete(deletePlayList);

playlistRouter.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);

playlistRouter.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

playlistRouter.route("/user/:userId").get(getUserPlaylists)


export {playlistRouter}