const express = require('express');
const cors  = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index.js')
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://root:root@cluster0.a0rji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, ()=> console.log(`Server start on port = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();