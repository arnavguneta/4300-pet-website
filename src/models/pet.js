const mongoose = require('mongoose')
const validator = require('validator')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

const petSchema = new mongoose.Schema({
    petapps: {
        type: Array,
        required: false
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        required: true,
        type: Number,
        validate(value) {
            if (value < 0) throw new Error('Age must be a positive number')
        }
    },
    petID: {
        required: true,
        type: Number,
        validate(value) {
            if (value < 0) throw new Error('ID must be positive')
        }
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: false,
        default: false
    },
    image: {
        type: String,
        required: true,
        default: '/img/harold.jpg'
    },
    adopted: {
        type: Boolean,
        required: false,
        default: false
    }
})

// petappSchema.statics.findByUserId = async (id) => {
//     const petapp = await PetApp.findOne({ user: id })
//     if (!petapp) throw new Error('No pet applications found for this user')
//     return petapp
// }

const Pet = mongoose.model('Pet', petSchema)

module.exports = { Pet }