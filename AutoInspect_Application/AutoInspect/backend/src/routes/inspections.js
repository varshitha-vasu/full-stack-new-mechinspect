import { Router } from 'express';
import Inspection from '../models/Inspection.js';
const router = Router();
router.get('/', async (_req,res,next)=>{ try { res.json(await Inspection.find().sort({createdAt:-1})); } catch(e){next(e);} });
router.get('/:id', async (req,res,next)=>{ try { const item=await Inspection.findById(req.params.id); if(!item)return res.status(404).json({message:'Inspection not found'}); res.json(item); } catch(e){next(e);} });
router.post('/', async (req,res,next)=>{ try { const item=await Inspection.create(req.body); res.status(201).json(item); } catch(e){next(e);} });
router.put('/:id', async (req,res,next)=>{ try { const item=await Inspection.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}); if(!item)return res.status(404).json({message:'Inspection not found'}); res.json(item); } catch(e){next(e);} });
router.delete('/:id', async (req,res,next)=>{ try { const item=await Inspection.findByIdAndDelete(req.params.id); if(!item)return res.status(404).json({message:'Inspection not found'}); res.json({message:'Inspection deleted'}); } catch(e){next(e);} });
export default router;