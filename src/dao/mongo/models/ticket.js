import mongoose from "mongoose";

const collection= 'Tikets'

const schema= new mongoose.Schema({

    userEmail: String,
    productsBought: [],
    productsWithoutStock:[],
    totalQuantity: Number,
    totalAmount:Number,
    generated_date: { type: Date, default: Date.now }


}, {timestamps:{createdAt: 'created_at', updatedAt: 'updated_at'}})

const tiketModel= mongoose.model(collection,schema)
export default tiketModel