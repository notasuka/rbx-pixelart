const http = require('http');
const express = require('express');
const fs = require('fs');
const { ResourceLoader, JSDOM } = require('jsdom')
const { createCanvas, loadImage } = require('canvas')
const path = require('path');
const { WebSocketServer } = require('ws');
const rgbToHex = require('rgb-to-hex');
const bodyParser = require('body-parser');
const { parse } = require('url')
const request = require('request');
const Pixelizer = require('image-pixelizer');
const Jimp = require('jimp');

const app = express();
const server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/output', (req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl
    var size = parseInt(query.size)
    var totalSize = size*size
    var finishedArray = new Map();

    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')
    loadImage(`${query.image}`).then((image) => {
        ctx.drawImage(image, 0,0)
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imgData, 0,0);
        fs.writeFileSync("out.json", JSON.stringify(imgData));

        var x = 0
        var y = 0
        var n = 0

        var pixelNum = 0
        for(let v=0; v !== totalSize; v++) {
            if(v % size * 4 == 0) {
                    
            }
            x += 1	
            n = v * 4
            pixelNum++
            finishedArray.set(pixelNum, {r: imgData.data[n], g: imgData.data[n+1], b: imgData.data[n+2]})
        }
            
        console.log('Pixel Count: %d', pixelNum)
        console.log('Map Count: %d', finishedArray.size)
        return res.send(`${fs.readFileSync('out.json')}`)
    })
})
app.post('/hex', (req, res) => {
    console.log(req.body)
    var color3 = req.body
     
    res.json({
        hex: rgbToHex(`rgb(${color3.r},${color3.g},${color3.b})`)
    })
})

server.listen(9001)


    /*if(color3.r===0 && color3.g===0 && color3.b===0) {
        return res.json({
            hex: rgbToHex(`rgb(255,255,255)`)
        })
    }*/