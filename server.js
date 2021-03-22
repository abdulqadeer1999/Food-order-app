var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var { foodUserModel, foodOrderModel, foodProductModel } = require('./dbconn/module')
var path = require("path")
var SERVER_SECRET = process.env.SECRET || "1234";
var jwt = require('jsonwebtoken')
var app = express()
var authRoutes = require('./routes/auth')
const fs = require('fs')
const admin = require("firebase-admin");
const multer = require('multer')

// const storage = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
//     destination: './uploads/',
//     filename: function (req, file, cb) {
//         cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
//     }
// })

// var upload = multer({ storage: storage })

// var serviceAccount = {
//     "type": "service_account",
//     "project_id": "auth-production-9273f",
//     "private_key_id": "3a701ad8ce8872913cc52d18ec71c8f6d2f6a20f",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6xzEsndh/VsCW\nO3idT2XmA9h8Mfh6YMVJ/vQmjV8CoKiYsH5xvdUufIBcRpWjXwRshA7JFiIk4sw/\nMM4YUe5X7CPbtLriCNQmwCYqak+3mG081Bku10tv2VTtQ31QWSTXKVuHBKIZii6T\nVz2cdomOmpdYni0n7w60b6A+Bvv+rmdMdkVeF8LNutuAWCl9anF9A6v8bVIpoUqI\nZ8EkooXgvW2Jk60OabIpw/cGuGnU4dh7UNhnNZitrKg1FqtDf1kK5UTrTSvToCj6\nyJ4WMsuQ9zYoHNtMR/u26YegXZhSHzl7CZkeQ3kKSuAGkwDRtOnuJN2xKIFV8mJt\npeK1td7pAgMBAAECggEAARx1l6fNogi/waworhfK8RDRA3JbxRMOh6MqjAJj9096\n7by6noNGttgyGtpubM0q6QOxcX3sVBQSOXEgVTOYd/U3IPPRTM5I3NKZYGqOKb47\nLlw9HFZW4/7mchw9rSsHCvg0WfhIFicIaQNS2tf+k/Mp8ADqrWldOrKvwM628Nom\n059HS1zKBZuuAAYvM9YBUwcYBeKADgKopnt1MAGCXcm+NYafToQTI3OGh0Fo+yHs\nzipjvxJCkcVJw6jpteCZ2rzgynLHQjj1HCUhLgt2moSierfGOG+z6Air5r1hByqR\nr9xhKIIOxzFtljYRY5kX69DLNPZAyewuv2nN/EH0EQKBgQDlz4GgiIEEKECCAnyh\nk9GU+2qRiOXL1FdN87toTyEw6g2xX7TPY5y2ixdAfFasvmQnwGg3i33Y6vQA9egq\ny92JsKulKTejLZFpDWlTm3H9X+xurKsHmdJ7HlgaOkbMdweaVHGyN2yMFYUhRici\nAt1lvdzNUEfVvkRLGtFcQABmNQKBgQDQEEGX8CmkoeFT7DDQDUgj+xX4LSYYo1IE\nAKYkzeXpYNZnNoeTTthx5lGISOiM8iXknWE1T7ZhQ29Yx/dAHNEwKRU8sH4ytPHJ\nfXKOgVWla/q7ETN9nhT58pSItLJX78jHy93H0tqat4Ak+t3MDxcoQHIk91/GsIDt\n7nIjfdjcZQKBgG3KezWEwY6I5Hi4U26mPkSc8MbizlZY9fTJ8sjctRC3YR9SiAFk\np6QWQ1+Nh6Mzuom7RI7014Tgiv5CfU6k4ww7GWXokSomRQgZXi6RXx4by8r8NyGE\nfahQUOsG2HgqjblPipoIHJW4WkgRSfTXxYor8Oct6YPWSK5Q+6DE+uvZAoGANwzW\nDhlhK0oZkFbh42pgOATrHyry9Xng7WYuj3Za6pDQqaZn4LXv1tMVp3WC8ifvlrl9\nStm4a6un/lmKNdBqGNAF6nTYLxppDuK+OK5HtukHAg/fC9GTwz5HxpPozBOJkDOE\njqZfaKg8o4wsux0TB3dlvBonoS56Lnn0gSd/BXECgYEA3V+CltYkiZJXjFkiLZIm\njeEZXOnkQzaCw7loJvZVBH5I7Z5ZRu3dlj3zWZFca4cwXlTQz4rTlD2WIM6Txl7k\nKG8T40LBslI0BJluNqVBk/BI6uY+PlgoQ0/fIpAoMK5zimxFS9IFWugn6f6rQzN3\nPR67p+zYrtvaKrQZd6QpUcM=\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-k9sh6@auth-production-9273f.iam.gserviceaccount.com",
//     "client_id": "115976507707524993759",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k9sh6%40auth-production-9273f.iam.gserviceaccount.com"
//   }
  

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://auth-production-9273f-default-rtdb.firebaseio.com/"
// });
// const bucket = admin.storage().bucket("gs://auth-production-9273f.appspot.com/");

// app.use(bodyParser.json());
// app.use(cookieParser());

// app.use(cors({
//     origin: ['http://localhost:3000',"https://login-system-jahan.herokuapp.com/"],
//     credentials: true
// }));
// app.use(morgan('dev'));
// app.use("/", express.static(path.resolve(path.join(__dirname, "./web/build"))));


const storage = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })

// const admin = require("firebase-admin");
// https://firebase.google.com/docs/storage/admin/start
var serviceAccount =  // create service account from here: https://console.firebase.google.com/u/0/project/delete-this-1329/settings/serviceaccounts/adminsdk
{
    "type": "service_account",
    "project_id": "auth-production-89fa8",
    "private_key_id": "0e299704d49dde4599c4f47f8d4219b2a014f17c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDKiSxuok+VXrwq\npBklvs7o0dDDaexBJq9loYxo3VA5THX48cF+6fSHZgQWGTA8J6Ng0bf59nIppIWr\nLphYb/C6FS34YnCrnldXRM/EBI/BWXQhSwxV+9nj2nK7g4m3mJXMNtBndAMy9fff\nkGlrYskVf4Q4gjn7EQdAwx7efpP1IXdOcq9B2SDVb96Wwsh2s/RwBqMZ0gURgrwN\nbOQEP2SnnNVgUGnPCbAD93bKVaDy/DuI/rCodoxJhvp0D6ePuXYl33363xWGtq95\ntNrU6viF/Oltk/Jrk8E3NF0QoNlyABAG5mpEQxWGy/4c7Af8evF6Eq17/t9+7wpO\nSQ47j9SVAgMBAAECggEAGHaxMzvPuQ8UU2I212RQwbZ2LORicQwnK3Nz7katJf6i\nUUuCP74qlyAvZivss5dmGI+8VSj7aSRCMQcTx7rdrNxaDSJ20YPysMvS/K5AXu5b\nJJpYBxrAmtEMArJEtDRuA5irW5Obv1AOfKaI1Tu9Zidc5SZ1smnAIoZu+Bj57iXB\nqIX3oI5OyqZdEr3D1JHWeUGnOBVnRS5khOL3HO0euqfRyl0Ru5w3duiA5TC9rpai\nocXq/xnDraW1SigIYk+veuM9mdpqV1bMWqnRNgfBPl29rRfcnM0Bun1N8CeBNibd\n4KZ+YVG8JG7/aR6kjGkrgE913BmBKhABcJK8tuhvkQKBgQDpvbbR7Q4CbgCyaGWG\npv1LQbmtt5nfjJyOpZ3Ikj/t7L4aIDzbs8Dhv3YCwHyfnEaMWI9W2XetRp7JkXlX\n2Tz+E2UjCYJgjemkn+yOUyOugwMw57DRwde1OmMOG7fQivw7rv1gC+7P4EtFryva\nweqUU75hYxwJ4PYKj+pMkoq9DwKBgQDd0rf6nSvmXGbF88109jVVYtDjed8rQbVa\ntEbDfDWtEVQLgty0Pst8zNmulT4zKc/nk4Fvox5YPTPmYQ6IS8NtxQiiLxDEcClq\nAtkelvZFBwS3AiaY8d01yV1CntcjoEDit8C2JKm7CZ56VTxOgSNRVIs0TzyykzK1\neShiZjvcGwKBgFlcJSumhCebpHqQfNf4uXdu/iySt6oGWMgUOvk2KGiujJLyZjHc\nS85CYzx0GHDwzuvS46Hha+Z7zDLlgc17CN1dztmRRh3hw0Qju81Bra+G+M5WlXvr\nrqrjUoFPSXvZ1sp+gPGaPkeMyVovuQVeA2+HgI481LhWH9oz4PA7Sf0zAoGAQikm\nXKZiQJwQvzv/bMI+mBAYE7D24jT//WTFsmqqq8r+UUyfvVb5ZGjJCGxVF/eBniV9\ntqllVJY0k6MhLX/Dc0sQTydQjfaSM59T2O7X1zDHtDn8/yMsgm1j1on/yw1yLOz3\nmpwGz9WHoh8oFJYpzYk0185GYVDMEBpp9Cdf9T8CgYA2av8cPG9RFdn1VSmDciIc\nnOwyfrR5d1cClnzGqk8uNswPAr0zUHu0S+4Oqz1P3S9HErRPrF9PVn8SutiMGReq\nEdezadjz9PEAp1mQ8IcYA/PXE4PJXfzW7Lxh2sGqzuE1uHpEw+jPyiuhyVXS8zPq\niRLScDgq45eq+ouVaVq5OA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-clna5@auth-production-89fa8.iam.gserviceaccount.com",
    "client_id": "115557154223056350282",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-clna5%40auth-production-89fa8.iam.gserviceaccount.com"
  }
  
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://auth-production-89fa8-default-rtdb.firebaseio.com/"
});
const bucket = admin.storage().bucket("gs://auth-production-89fa8.appspot.com");

 app.use(bodyParser.json());
app.use(cookieParser());

 app.use(cors({
    origin: ['http://localhost:3000'],
     credentials: true
 }));
 app.use(morgan('dev'));
app.use("/", express.static(path.resolve(path.join(__dirname, "./front-end/build"))));

app.use('/', authRoutes);
app.use(function (req, res, next) {
    console.log(req.cookies.jToken)
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate;

            if (diff > 300000) {
                res.status(401).send("token expired")
            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    role: decodedData.role
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86400000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/profile", (req, res, next) => {

    console.log(req.body)

    foodUserModel.findById(req.body.jToken.id, 'name email phone role createdOn',
        function (err, doc) {
            console.log("doc", doc)
            if (!err) {
                res.send({
                    status: 200,
                    profile: doc
                })

            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})
app.post("/addProduct", upload.any(), (req, res, next) => {

    console.log("req.body: ", req.body);
    bucket.upload(
        req.files[0].path,
        function (err, file, apiResponse) {
            if (!err) {
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0])
                        foodUserModel.findById(req.headers.jToken.id, 'email role', (err, user) => {
                            console.log("user =======>", user.email)
                            if (!err) {
                                foodProductModel.create({
                                    "name": req.body.productName,
                                    "price": req.body.price,
                                    "stock": req.body.stock,
                                    "image": urlData[0],
                                    "description": req.body.description
                                }).then((data) => {
                                    console.log(data)
                                    res.send({
                                        status: 200,
                                        message: "Product add successfully",
                                        data: data
                                    })
                                }).catch(() => {
                                    console.log(err);
                                    res.status(500).send({
                                        message: "user create error, " + err
                                    })
                                })
                            }
                            else {
                                res.send("err")
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})

app.post("/order", (req, res, next) => {
    console.log("fsfsf", req.body)
    if (!req.body.orders || !req.body.total) {

        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "orders": "order",
                "total": "12342",
            }`)
        return;
    }

    foodUserModel.findOne({ email: req.body.jToken.email }, (err, user) => {
        console.log("afafa", user)
        if (!err) {
            foodOrderModel.create({
                name: req.body.name,
                email: user.email,
                phone: req.body.phone,
                status: "In review",
                address: req.body.address,
                total: req.body.total,
                orders: req.body.orders
            }).then((data) => {
                res.send({
                    status: 200,
                    message: "Order have been submitted",
                    data: data
                })
            }).catch(() => {
                res.status(500).send({
                    message: "order submit error, " + err
                })
            })
        }
        else {
            console.log(err)
        }
    })
})

app.get('/getOrders', (req, res, next) => {
    foodOrderModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})
app.get('/getProducts', (req, res, next) => {
    foodProductModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})
app.get('/myOrders' ,(req,res,next)=>{
    foodUserModel.findOne({email: req.body.jToken.email},(err,user)=>{
        if (user) {
            foodOrderModel.find({email: req.body.jToken.email},(err,data)=>{
                if (data) {
                    res.send({
                        data:data
                    })
                }
                else{
                    res.send(err)
                }
            })
        }else{
            res.send(err)
        }
    })
})

app.post('/updateStatus',(req,res,next)=>{
    foodOrderModel.findById({_id: req.body.id},(err,data)=>{
        if (data) {
            data.updateOne({status: req.body.status},(err,update)=>{
                if (update) {
                    res.send("Status update")
                }
                else{
                    res.send(err)
                }
            })
        }
        else{
            res.send(err)
        }
    })
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})
