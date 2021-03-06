const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../models');
const mustBeLoggedIn = require('../middleware/mustBeLoggedIn');

function getCurrentUser (req, res) {
    // I'm picking only the specific fields its OK for the audience to see publicly
    // never send the whole user object in the response, and only show things it's OK
    // for others to read (like ID, name, email address, etc.)
    const { id, username, symKey } = req.user;
    res.json({
        id,
        username,
        symKey
    });
}

router
    .route('/auth')
    // GET to /api/auth will return current logged in user info
    .get((req, res) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'You are not currently logged in.',
            });
        }

        getCurrentUser(req, res);
    })
    // POST to /api/auth with username and password will authenticate the user
    .post(passport.authenticate('local'), (req, res) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Invalid username or password.',
            });
        }

        getCurrentUser(req, res);
    })
    // DELETE to /api/auth will log the user out
    .delete((req, res) => {
        req.logout();
        req.session.destroy();
        res.json({
            message: 'You have been logged out.',
        });
    });

router
    .route('/users')
    // POST to /api/users will create a new user
    .post((req, res, next) => {
        db.User.create(req.body)
            .then((user) => {
                const { id, username } = user;
                res.json({
                    id,
                    username,
                });
            })
            .catch((err) => {
                // if this error code is thrown, that means the username already exists.
                // let's handle that nicely by redirecting them back to the create screen
                // with that flash message
                if (err.code === 11000) {
                    res.status(400).json({
                        message: 'Username already in use.',
                    });
                }

                // otherwise, it's some nasty unexpected error, so we'll just send it off to
                // to the next middleware to handle the error.
                next(err);
            });
    });

router.route('/vault')
    // GET to /api/vault will return the user's encrypted vault
    .get(mustBeLoggedIn(), (req, res) => {
        // at this point we can assume the user is logged in. if not, the mustBeLoggedIn middleware would have caught it
        db.User.findOne({ username: req.user.username }, { _id: 0, vault: 1 })
            .clone()
            .then((user) => {
                res.json(user);
            });
    })
    // POST to /api/vault will update the user's vault
    .post(mustBeLoggedIn(), (req, res, next) => {
        db.User.updateOne({ username: req.user.username }, { vault: req.body.encryptedVault })
            .clone()
            .then(() => {
                res.status(200).json({});
            })
            .catch((err) => {
                next(err);
            });
    });

module.exports = router;
