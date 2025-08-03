import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db/db_index.js'
import express from 'express'

connectDB()  

