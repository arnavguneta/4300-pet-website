const path = require('path')
const express = require('express')
const hbs = require('hbs')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const auth = require('./middleware/auth')
const { User } = require('./models/user')
const { PetApp } = require('./models/petapp')
const { Pet } = require('./models/pet')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

// paths for express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// handlebars setup
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static dir to serve
app.use(express.json())
app.use(express.static(publicPath))

app.get('', async (req, res) => {
    res.render('index', {
        title: 'Home'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About'
    })
})

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us',
    })
})

app.get('/ourpets', (req, res) => {
    res.render('ourpets', {
        title: 'Our Pets',
    })
})

app.get('/ourpets/apply', (req, res) => {
    res.render('petapp', {
        title: 'Pet Application',
    })
})

app.get('/centers', (req, res) => {
    res.render('centers', {
        title: 'Centers Near You',
    })
})

app.get('/getinvolved', (req, res) => {
    res.render('getinvolved', {
        title: 'Get Involved',
    })
})

app.get('/resources', (req, res) => {
    res.render('resources', {
        title: 'Other Resources',
    })
})

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Log In',
    })
})

app.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Sign Up',
    })
})

app.get('/account', (req, res) => {
    res.render('account', {
        title: 'My Account',
    })
})

app.get('/admin/pets/add', (req, res) => {
    res.render('createpets', {
        title: 'Add Pets',
    })
})

app.get('/admin/pets', (req, res) => {
    res.render('managepets', {
        title: 'Manage Pets',
    })
})

app.get('/admin/petapps', (req, res) => {
    res.render('managepetapp', {
        title: 'Manage Pet Applications',
    })
})

// API

app.post('/api/users/update', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) throw new Error()
        res.send({ name: user.name });
    } catch (error) {
        res.send({})
    }
})

app.post('/api/users/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/api/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/api/users/logallout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/api/users/me', auth, async (req, res) => {
    // auth self check
    res.send(req.user)
})

app.get('/api/users/reqadmin', auth, async (req, res) => {
    if (req.user.isAdmin) return res.status(200).send()
    fetch(process.env.WEBHOOK, {method: 'POST', body: JSON.stringify({
        username: "arnav.guneta.com/pets-web",
        content: `${req.user.name} has request admin access\nID: ${req.user._id}`,
        avatar_url: "https://i.imgur.com/9mszcmY.jpg"
    }), headers: { 'Content-Type': 'application/json' }}).then(hookRes => res.status(hookRes.status).send())
})

app.post('/api/users/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(400).send('Not sufficient permissions')

    const _id = req.params.id;
    try {
        const user = await User.findById(_id)
        if (!user) return res.status(404).send()
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

app.patch('/api/users/:id', auth, async (req, res) => {
    const _id = req.params.id
    if (!req.user.id !== _id && !req.user.isAdmin) return res.status(400).send('Not sufficient permissions')

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age', 'petapp']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid update!' })

    try {
        const user = await User.findById(_id)
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        if (!user) return res.status(404).send()
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.delete('/api/users/:id', auth, async (req, res) => {
    const _id = req.params.id
    if (!req.user.id !== _id && !req.user.isAdmin) return res.status(400).send('Not sufficient permissions')

    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) return res.status(404).send()
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/api/petapps/create', auth, async (req, res) => {
    const petapp = new PetApp(req.body)
    try {
        await petapp.save()
        res.status(201).send({ petapp })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/api/petapps/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const petapp = await PetApp.findById(_id)
        if (!petapp) return res.status(404).send()
        res.send(petapp)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/api/petapps/all', async (req, res) => {
    
    try {
        const papps = await PetApp.find({})
        console.log({papps})
        if (!papps) return res.status(404).send()
        res.send(papps)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.patch('/api/petapps/:id', auth, async (req, res) => {
    const _id = req.params.id
    if (!req.user.id !== _id && !req.user.isAdmin) return res.status(400).send('Not sufficient permissions')
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'petIDs', 'number', 'address', 'reason', 'approved']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid update!' })

    try {
        const petapp = await PetApp.findById(_id)
        updates.forEach(update => petapp[update] = req.body[update])
        await petapp.save()
        if (!petapp) return res.status(404).send()
        res.send(petapp)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.delete('/api/petapps/:id', auth, async (req, res) => {
    const _id = req.params.id
    if (!req.user.id !== _id && !req.user.isAdmin) return res.status(400).send('Not sufficient permissions')

    try {
        const petapp = await PetApp.findByIdAndDelete(_id)
        if (!petapp) return res.status(404).send()
        res.send(petapp)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/api/pets/create', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(400).send('Not sufficient permissions')

    const pet = new Pet(req.body)
    try {
        await pet.save()
        res.status(201).send(pet)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/api/pets/:id', auth, async (req, res) => {
    // if user.id == id, no admin needed
    const _id = req.params.id;
    try {
        const pet = await Pet.findOne({petID:_id})
        if (!pet) return res.status(404).send()
        res.send(pet)
    } catch (error) {
        res.status(500).send()
    }
})

app.get('/api/pets/all', async (req, res) => {
    // if user.id == id, no admin needed
    try {
        const pets = await Pet.find({})
        if (!pets) return res.status(404).send()
        res.send(pets)
    } catch (error) {
        res.status(500).send()
    }
})

app.patch('/api/pets/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(400).send('Not sufficient permissions')

    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'petID', 'breed', 'type', 'petapps', 'image','adopted']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid update!' })

    try {
        const pet = await Pet.findOne({petID:_id})
        updates.forEach(update => pet[update] = req.body[update])
        await pet.save()
        if (!pet) return res.status(404).send()
        res.send(pet)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.delete('/api/pets/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(400).send('Not sufficient permissions')
    const _id = req.params.id

    try {
        const pet = await Pet.findByIdAndDelete(_id)
        if (!pet) return res.status(404).send()
        res.send(pet)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page not found',
        name: 'Arnav Guneta',
        message: 'The page you were looking for was not found. \nTry again by going back to the weather page.'
    })
})

app.listen(port, () => {
    console.log('server is up on port ' + port)
})
