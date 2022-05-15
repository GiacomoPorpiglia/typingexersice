const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require('fs')
const app = express()
const dotenv = require('dotenv').config()
const path = require('path')

app.use(bodyParser.urlencoded({extended: true, limit: "32mb"}))
app.use(bodyParser.json({extended: true, limit: "32mb"}))
app.use(cors())





app.get('/api', (req, res) => {
    res.status(200).send("Working")
})

app.get('/api/newstring', (req, res) => {
    const stringFile = fs.readFileSync("wordsList.txt", 'utf-8')
    arrayOfStrings = stringFile.split('\n')

    string = ""
    stringLength = Math.floor(Math.random() * 10 + 5)

    for(let i = 0; i < stringLength; i++) {
        string += arrayOfStrings[Math.floor(Math.random() * arrayOfStrings.length)].slice(0, -1)
        if(i != stringLength) string += " "
    }
    res.status(200).json(string)
})


//SERVER PRODUCTOIN ASSESTS
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')))
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}



const PORT = process.env.PORT || 5000

app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`);
})
