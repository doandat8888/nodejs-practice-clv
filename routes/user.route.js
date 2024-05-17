const express = require('express');
const route = express.Router();
const { userValidate } = require('../helpers/user.validate.helper');
const users = require('../data/users');
 
route.get('/', (req, res) => {
    return res.status(200).json({
        data: users
    })
})

route.post('/create', (req, res) => {
    const { username, fullname, role, projects, activeYn } = req.body;
    const { error } = userValidate(req.body);
    if(error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json(errorMessages);
    }
    const userExist = users.find((user) => user.username === username);
    if(userExist) {
        return res.status(400).json({
            msg: 'Username already exist. Please try again!'
        })
    }
    // Create new user
    const newUser = {
        username,
        fullname,
        role,
        projects,
        activeYn
    }
    users.push(newUser);
    res.status(201).json({
        msg: 'Create new user successfully'
    })
});

route.patch('/update/:username', (req, res) => {
    const { username } = req.params;
    if(!username) {
        return res.status(400).json({
            msg: 'Missing username'
        })
    }
    const user = users.find((user) => user.username === username);
    if(!user) {
        return res.status(404).json({
            msg: 'User not found'
        })
    }
    // Update user info
    const patchData = req.body;
    Object.keys(patchData).forEach(key => {
        if (patchData[key] !== undefined) {
            user[key] = patchData[key];
        }
    })
    return res.status(200).json({
        msg: 'Update user successfully'
    })
});

route.delete('/delete/:username', (req, res) => {
    const { username } = req.params;
    if(!username) {
        return res.status(400).json({
            msg: 'Missing username'
        })
    }
    const user = users.find((user) => user.username === username);
    if(!user) {
        return res.status(404).json({
            msg: 'User not found'
        })
    }
    // Delete user
    users.splice(users.indexOf(user), 1);
    return res.status(200).json({
        msg: 'Delete user successfully'
    })
});

route.get('/search', (req, res) => {
    const searchParams = req.query;
    for (const key in searchParams) {
        // Check if user has key
        if (!users[0][key]) {
            return res.status(404).json({
                msg: "This property isn't exist"
            });
        }
    }

    const searchResult = searchUsers(searchParams);
    if(searchResult.length === 0) {
        return res.status(404).json({
            msg: 'User not found'
        })
    }
    return res.status(200).json({
        data: searchResult
    })
});

function searchUsers(searchParams) {
    return users.filter(user => {
        for (const key in searchParams) {
            if (searchParams[key]) {
                if (key === "projects") {
                    const projects = searchParams[key];
                    for (const project of projects) {
                        if (!user[key].includes(project)) {
                            return false;
                        }
                    }
                } else {
                    if (user[key].toLowerCase().indexOf(searchParams[key].toLowerCase()) === -1) {
                        return false;
                    }
                }
            }
        }
        return true;
    });
}

module.exports = route;