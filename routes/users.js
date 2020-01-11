const router = require('express').Router();
let User = require('../models/user_model');

router.route('/').get((req, res) => {
    console.log(req.query.userID);
    User.findOne({userID: req.query.userID})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/major').post((req, res) => {
    //console.log(req.body.userID);
    User.findOneAndUpdate({userID: req.body.userID}, {$inc: {"majorReports": 1}})
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/minor').post((req, res) => {
    //console.log(req.body.userID);
    User.findOneAndUpdate({userID: req.body.userID}, {$inc: {"minorReports": 1}})
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update').post((req, res) =>{
    User.findOneAndUpdate({userID:req.body.userID},{$inc:{"minorReports": -3, "majorReports": 1}})
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete').post((req, res) => {
    User.findOneAndDelete({userID: req.body.userID})
        .then(user => res.json('User banned'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const userID = req.body.userID;
    const username = req.body.username;
    const minorReports = req.body.minorReports;
    const majorReports = req.body.majorReports;

    const newUser = new User({userID, username, minorReports, majorReports});

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error ' + err));
});

module.exports = router;