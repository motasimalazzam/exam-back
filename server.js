`use strict`;

const express=require('express');
const cors=require('cors');
const axios=require('axios');
require('dotenv').config();
const mongoose=require('mongoose');

const server=express();
server.use(cors());
server.use(express.json());

const PORT=process.env.PORT;

mongoose.connect('mongodb://localhost:27017/digimons',{ useNewUrlParser: true, useUnifiedTopology: true });

// DATABASE
const digimonSchema = new mongoose.Schema({
    name:String,
    img:String,
    level:String
});

const digimonModel = mongoose.model('digimons',digimonSchema)

// SERVER RQ
server.get('/digimons',getData);
server.post('/addToFav',addToFav);
server.get('/getFavDigimons',getFav);
server.delete('/deleteDigimons/:id',deletDigimons);
server.put('/updateDigimons/:id',updatDigimons)

// RQ FUNCTIONS
function getData(req,res){

    const url=`https://digimon-api.vercel.app/api/digimon`;
    // console.log(url.data)

    axios.get(url).then(results=>{
        const digimonsArr=results.data.map(digimon=>{
            return (new Digimon(digimon))
        })
        res.send(digimonsArr)
    })

};

function addToFav(req,res){

    const {name, img, level}=req.body;
    const newdigimon = new digimonModel({
        name:name,
        img:img,
        level:level
    })
    newdigimon.save();
};

function getFav(req,res){
    digimonModel.find({},(error,favData)=>{
        res.send(favData)
    })
};

function deletDigimons(req,res){
    const id=req.params.id;
    digimonModel.remove({_id:id},(error,data)=>{
        digimonModel.find({},(error,deleteData)=>{
            res.send(deleteData)
        })
    })
};

function updatDigimons(req,res){
    const id=req.params.id;
    console.log(req.body)
    const {digimonName, digimonImage, digimonlevel}=req.body
    digimonModel.findOne({_id:id},(error,data)=>{
        digimonModel.find({},(error,updateData)=>{
            updateData.name=digimonName
            updateData.img=digimonImage
            updateData.level=digimonlevel


            updateData.save().then(()=>{
                res.send(data)
            })
        })
    })
}


class Digimon{
    constructor(data){
        this.name=data.name
        this.img=data.img
        this.level=data.level
    }
}

server.listen(PORT,()=>{
    console.log(`listening from PORT ${PORT}`)
})