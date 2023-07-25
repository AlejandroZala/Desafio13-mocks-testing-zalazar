import tiketModel from '../models/tiket.js'

export default class TiketManager{

    getTiket=(tid)=>{
        return tiketModel.findById(tid)
    }
    createTiket=(tiket)=>{
        return tiketModel.create(tiket)
    }
    deleteTiket=(tid)=>{
        return tiketModel.findByIdAndDelete(tid)
    }
}