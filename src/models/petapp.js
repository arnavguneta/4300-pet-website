const mongoose = require('mongoose')
const validator = require('validator')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

const petappSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Email is invalid!')
        }
    },
    petIDs: {
        required: true,
        type: Array,
        validate(value) {
            if (value < 0) throw new Error('Age must be a positive number')
        }
    },
    number: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        validate(value) {
            if (!validator.isMobilePhone(value)) throw new Error('Phone number is invalid!')
        }
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    approved: {
        type: Boolean,
        required: false,
        default: false
    }
})

petappSchema.statics.findByUserId = async (id) => {
    const petapp = await PetApp.findOne({ user: id })
    if (!petapp) throw new Error('No pet applications found for this user')
    return petapp
}

const PetApp = mongoose.model('PetApp', petappSchema)

module.exports = { PetApp }