const mongoose = require('mongoose')

// Command to start db: /c/Users/arnav/mongodb/bin/mongod --dbpath=C:/Users/arnav/mongodb-data
mongoose.connect('mongodb://127.0.0.1:27017/pet-website-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})