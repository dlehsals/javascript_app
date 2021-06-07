import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';

const PORT = 8080;
const app = express();
mongoose.connect("mongodb://localhost/7777", {
    useNewUrlParser: true,
    useCreateIndex : true,
});
// const UserSchema = new mongoose.Schema({
//     name : String,
//     age  : Number,
//     saveData: {
//         type: Date,
//         default: Date.now,
//     },
// });
// const User = mongoose.model("Hustar", UserSchema);
// const me = new User({
//     name : "donmin",
//     age : 27,
// });
// me.save().then(() => {
//     console.log(me);
// }).catch((err)=>{
//     console.log("Error : "+err);
// });


app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const upload_setup = multer({
    dest: 'upload/',
    limits: 50*1024*1024
});
app.post('/upload', upload_setup.single('myfile'), (req, res) => {
    console.log(JSON.stringify(req.file));
    res.send(req.file);
})
app.get('/product', (req, res) => {
    res.send([
        {
            name: '가방',
            price: '1000',
            image: 'http://loremflickr.com/200/200?random=1'
        }, {
            name: '컴퓨터',
            price: '2000',
            image: 'http://loremflickr.com/200/200?random=2'
        }, {
            name: '노트북',
            price: '3000',
            image: 'http://loremflickr.com/200/200?random=3'
        }, {
            name: '키보드',
            price: '4000',
            image: 'http://loremflickr.com/200/200?random=4'
        }
    ]);
});
