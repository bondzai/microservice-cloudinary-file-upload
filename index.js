require("dotenv").config();
var bcrypt = require('bcryptjs');
const express = require("express");
const path = require('path');
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const app = express();

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, PORT } = process.env
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

app.post("/upload", async (req, res) => {
    const mySecret = await bcrypt.hash(req.body.spellSecret, 10);
    if (req.body.spellSecret && (await bcrypt.compare(process.env.SPELL_SECRET, mySecret))) { 
        const uploadFolder = "labs"
        let result;
        let file = req.files.samplefile;
        if (req.files.samplefile.length === undefined) {
            result = await cloudinary.uploader.upload(file.tempFilePath, {folder: uploadFolder });
            console.log(result);
            res.render("uploaded");
        } else if (req.files) {
            let imageArray = [];
            for (let index = 0; index < req.files.samplefile.length; index++) {
            result = await cloudinary.uploader.upload(req.files.samplefile[index].tempFilePath,{ folder: uploadFolder });
            imageArray.push({
                public_id: result.public_id,
                secure_url: result.secure_url,
            });
            }
            details = {
                user: req.body.username,
                result,
                imageArray,
            };
            console.log(details);
            res.render("uploaded");
        }
    } else {
        res.render("retry");
    }
});

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => console.log(`Server is runnning at port ${PORT}`));