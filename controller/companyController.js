const express = require('express');
const companyRoute = express.Router();

const dbcofig = require('../config/DB_config')
//Get all
companyRoute.get('/companys', function (req, res, next) {
        dbcofig.query(
            'SELECT * FROM `company`',function(err, result) {
                res.json(result);
            }
        )
    })

    //Get by id
    companyRoute.get('/company/:id', function (req, res, next) {
        const companyId = req.params.id ;
        dbcofig.query(
            'SELECT * FROM `company` WHERE `CompanyId`=?',[companyId],
            function(err, result) {
                res.json(result);
            }
        )
    })

    //Post 
    companyRoute.post('/company', function (req, res, next) {
        dbcofig.query(
            'INSERT INTO `company`(`CompanyName`, `CompanyAbbr`) VALUES (?, ?)',
            [
                req.body.CompanyName, 
                req.body.CompanyAbbr,
            ],
            function(err, result) {
                res.json(result);
            }
        )
    })

    //Put
    companyRoute.put('/company/:id', function (req, res, next) {
        const companyId = req.params.id;
        dbcofig.query(
            'UPDATE `company` SET `CompanyName`=?, `CompanyAbbr`=?, WHERE CompanyId=?',
            [
                req.body.CompanyName, 
                req.body.CompanyAbbr, 
                companyId
            ],
            function(err, result) {
                res.json(result);
            }
        )
    })

    //Delete
    companyRoute.delete('/company/:id', function (req, res, next) {
        const companyId = req.params.id;
        dbcofig.query(
            'DELETE FROM `company` WHERE CompanyId=?',[companyId],
            function(err, result) {
                res.json(result);
            }
        )
    })

module.exports = companyRoute;