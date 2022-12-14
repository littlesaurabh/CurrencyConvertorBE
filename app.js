const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { request } = require('express')
const moment=require('moment')
const port = process.env.PORT || 3001

const app = express()
app.use(cors())
app.use(bodyParser.json())

const today=moment(new Date()).format('DD/MM/YYYY')


mongoose.connect('mongodb://localhost:27017/Currency').then(res => {
    console.log("Db Connected")
}).catch(err => {
    console.log("Error", err)
})

const currencyScheme = new mongoose.Schema({
    conversionId: {
        type: String,
        required: true,
        unique: true
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    exchangeRate: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    }
})

const Currency = mongoose.model('currencies', currencyScheme)

// Currency.find({}, (err, found) => {
//     if (!err) {
//         console.log(found)
//     } else {
//         res.send(err.message)
//     }
// })

// app.get("/getRateDemo",(req,res)=>{
//     Currency.find({},(err,found)=>{
//         if(!err){
//             console.log(found)
//         }
//     }) 
// })

app.post("/addRateAnyDateTest", (req, res) => {
    let data = new Currency({
        from: req.body.from,
        to: req.body.to,
        exchangeRate: req.body.exchangeRate,
        date: req.body.date,
        conversionId: req.body.from + '_' + req.body.to + '_' + req.body.date
    })

    data.save().then(() => res.send("Data added successfully!"), console.log("Data added")).catch((err) => {
        res.send(err.message)
    })


})

app.post("/addRate", (req, res) => {
    let data = new Currency({
        from: req.body.from,
        to: req.body.to,
        exchangeRate: req.body.exchangeRate,
        date: today,
        conversionId: req.body.from + '_' + req.body.to + '_' + today
    })

    data.save().then(() => res.send("Data added successfully!"), console.log("Data added")).catch((err) => {
        res.send(err.message)
    })


})


app.get("/getRateAll", (req, res) => {
    Currency.find({}, (err, found) => {
        if (!err) {
            console.log(found)
            res.send(found)
        } else {
            res.send(err.message)
        }
    })


})

app.get("/getRateAllToday", (req, res) => {
    Currency.find({date:moment(new Date()).format('DD/MM/YYYY')}, (err, found) => {
        if (!err) {
            console.log(found)
            res.send(found)
        } else {
            res.send(err.message)
        }
    })


})
app.get("/getRate/:from/:to", (req, res) => {
    Currency.find({
        from: req.params.from,
        to: req.params.to
    }, (err, found) => {
        if (!err) {
            console.log(found)
            res.send(found)
        } else {
            res.send(err.message)
        }
    })


})

app.get("/getRateDate/:from/:to/:date", (req, res) => {
    Currency.find({
        from: req.params.from,
        to: req.params.to,
        date: new Date(req.params.date).toLocaleDateString()
    }, (err, found) => {
        if (!err) {
            console.log(found)
            res.send(found)
        } else {
            res.send(err.message)
        }
    })


})




app.put("/updateRate", (req, res) => {

    let data = {
        from: req.body.from,
        to: req.body.to,
        exchangeRate: req.body.exchangeRate,
        date: req.body.date,
        conversionId: req.body.conversionId
    }
   
    Currency.updateOne({
        conversionId: req.body.conversionId
    }, {
        $set: data
    }, (err,resp) => {
        console.log(req.body.conversionId)
        if (err) {
            res.send(err.message)
            console.log(err)
        } else {

            res.send(resp)
        }
    })

})


app.delete("/deleteRate", (req, res) => {
    Currency.deleteOne({
        "conversionId": req.body.conversionId
    }, (err, data) => {
        if (err) {
            console.log(err)
            res.send(err.message)
        } else {

            res.send(data)
            console.log(data)
        }
    })

})


app.listen(port, () => {
    console.log("Server is running on port 3001")
})
