const express=require('express')
const app = express()
const PORT=8080;
app.use(express.json())
app.get('/tshirt',(req,res)=>{
    res.status(200).send({
        tshirt:'##',
        size:'large'
    })
})
app.listen(PORT,()=>
console.log(`it's alive on http://localhost:${PORT}`)
)