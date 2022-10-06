const express = require('express');
const partnerRoute = express.Router();

const dbcofig = require('../config/DB_config')
//Get all
partnerRoute.get('/partners', function (req, res, next) {
        dbcofig.query(
            'SELECT * FROM `partner`',function(err, result) {
                res.json(result);
            }
        )
    })

    //Get by id
    partnerRoute.get('/partner/:id', function (req, res, next) {
        const partnerId = req.params.id ;
        dbcofig.query(
            'SELECT * FROM `partner` WHERE `PartnerId`=?',[partnerId],
            function(err, result) {
                res.json(result);
            }
        )
    })

    //Post 
    partnerRoute.post('/partner', function (req, res, next) {
        dbcofig.query(
            'INSERT INTO `partner`(`PartnerName`, `Province`, `Address`, `Telephone`, `Email`, `ModifiedDate`) VALUES (?, ?, ?, ?, ?)',
            [
                req.body.PartnerName, 
                req.body.Province, 
                req.body.Address,
                req.body.Telephone,
                req.body.Email
            ],
            function(err, result) {
                res.json(result);
            }
        )
    })

    //Put
    partnerRoute.put('/partner/:id', function (req, res, next) {
        const partnerId = req.params.id;
        dbcofig.query(
            'UPDATE `partner` SET `PartnerName`=?, `Province`=?, `Address`=?, `Telephone`=?, `Email`=?, `ModifiedDate`=? WHERE PartnerId=?',
            [
                req.body.PartnerName, 
                req.body.Province, 
                req.body.Address,
                req.body.Telephone,
                req.body.Email,
                partnerId
            ],
            function(err, result) {
                res.json(result);
            }
        )
    })

    //Delete
    partnerRoute.delete('/partner/:id', function (req, res, next) {
        const partnerId = req.params.id;
        dbcofig.query(
            'DELETE FROM `partner` WHERE PartnerId=?',[partnerId],
            function(err, result) {
                res.json(result);
            }
        )
    })

module.exports = partnerRoute;