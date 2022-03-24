const { readDb, writeDb } = require('./dbFunctions')
const express = require('express')
const app = express()
const port = 9393

//Middleware
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send({ friends: readDb().friends })
})

app.get('/aloha/james', (req, res) => {
    res.send('aloha')
})

app.get('/:friend', (req, res) => {
    const { friend } = req.params
    const { limit } = req.query
    console.log(limit)
    res.status(200).send({
        message: readDb().friends.filter(friendd => {
            return friendd.includes(friend)
        }).splice(0, limit)
    })
})

app.post('/', (req, res) => {
    const { newFriend } = req.body
    if (!newFriend) {
        return res.status(400).send({ message: "Please include friend name" })
    }

    try {
        const currFriends = readDb().friends
        writeDb({ friends: [...currFriends, newFriend] })
    } catch (err) {
        writeDb({ friends: [newFriend] })
    }

    res.status(200).send({ message: `added your friend: ${newFriend}` })
})

// app.put('/', (req, res) => {

// })

app.delete('/', (req, res) => {
    const { enemy } = req.body
    console.log(enemy)
    try {
        const currFriends = readDb().friends
        writeDb({
            friends: currFriends.filter(friend => {
                return !friend.includes(enemy)
            })
        })
        res.status(200).send({ friendsList: readDb().friends })
    } catch (err) {
        res.status(400).send({ message: 'you have no friends' })
    }
})

app.listen(port, () => console.log(`Server started on port: ${port}`))