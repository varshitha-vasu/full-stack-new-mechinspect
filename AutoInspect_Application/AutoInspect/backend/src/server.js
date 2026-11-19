import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import inspections from './routes/inspections.js';
import Inspection from './models/Inspection.js';
dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
let databaseStatus = 'connecting';
app.get('/api/health',(_req,res)=>res.json({status:'ok',service:'AutoInspect API',database:databaseStatus}));
app.use('/api/inspections',inspections);
app.get('/api/dashboard/stats',async(_req,res,next)=>{try{const total=await Inspection.countDocuments();const passed=await Inspection.countDocuments({result:'Pass'});res.json({total,passed,failed:total-passed,passRate:total?Math.round(passed/total*100):0});}catch(e){next(e);}});
app.use((err,_req,res,_next)=>{console.error(err);res.status(err.name==='ValidationError'?400:500).json({message:err.message||'Server error'});});
const port=process.env.PORT||5000;
app.listen(port,()=>console.log(`AutoInspect API running on ${port}`));

mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/autoinSpect')
 .then(()=>{
   databaseStatus='connected';
   console.log('MongoDB connected');
 })
 .catch(err=>{
   databaseStatus='disconnected';
   console.error('MongoDB connection failed:',err.message);
 });