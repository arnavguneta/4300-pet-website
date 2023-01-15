const mongoose = require('mongoose')

// Command to start db: /c/Users/arnav/mongodb/bin/mongod --dbpath=C:/Users/arnav/mongodb-data
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})