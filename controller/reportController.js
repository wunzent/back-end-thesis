const express = require('express');
const reportRoute = express.Router();

const dbcofig = require('../config/DB_config')
//Get all
reportRoute.get('/get-reports', async (req, res, next) => {
    try {
        dbcofig.execute(
            'SELECT * FROM report', (err, results) => {
                if (err) {
                    return res.json({ status: "error", message: err })
                }
                res.json(results);
            }
        )
    } catch (err) {
        return res.json({ status: "error", message: err.message })
    }
})
reportRoute.get('/get-reports/:id', async (req, res, next) => {
    try {
        dbcofig.execute(
            'SELECT * FROM (report INNER JOIN users ON report.userId = users.userId) WHERE ContractId =?',[req.params.id], (err, results) => {
                if (err) {
                    return res.json({ status: "error", message: err })
                }
                res.json(results);
            }
        )
    } catch (err) {
        return res.json({ status: "error", message: err.message })
    }
})
//Get all
reportRoute.get('/reports', async (req, res, next) => {
    try {
        dbcofig.execute(
            'SELECT * FROM ((report INNER JOIN users ON report.userId = users.userId)INNER JOIN contract ON report.ContractId = contract.ContractId)', (err, results) => {
                if (err) {
                    return res.json({ status: "error", message: err })
                }
                res.json(results);
            }
        )
    } catch (err) {
        return res.json({ status: "error", message: err.message })
    }
})

reportRoute.get('/report-join/:id', async (req, res, next) => {
    try {
        dbcofig.execute(
            'SELECT * FROM ((report INNER JOIN users ON report.userId = users.userId)INNER JOIN contract ON report.ContractId = contract.ContractId) WHERE reportId=?', [req.params.id], (err, results) => {
                if (err) {
                    return res.json({ status: "error", message: err })
                }
                res.json(results);
            }
        )
    } catch (err) {
        return res.json({ status: "error", message: err.message })
    }
})

//Get by id
reportRoute.get('/report/:id', async (req, res, next) => {
    try {
        dbcofig.query(
            'SELECT * FROM `report` WHERE `reportId`=?', [req.params.id], (err, results) => {
                if (err) { return res.json({ status: "error", message: err }) }
                res.json(results);
            }
        )
    } catch (err) {
        return res.json({ status: "error", message: err.message })
    }
})

//Post 
reportRoute.post('/create-report', async (req, res, next) => {
    const { ContractId, reportDate, morWeather, afterWeather, contractSite, reportActivity, reportProblem, worker, userId, note } = req.body
    try {
        dbcofig.query(
            'INSERT INTO `report`(`ContractId`, `reportDate`, `morWeather`, `afterWeather`, `contractSite`, `reportActivity`, `reportProblem`, `worker`, `userId`, `note`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                ContractId,
                reportDate,
                morWeather,
                afterWeather,
                contractSite,
                reportActivity,
                reportProblem,
                worker,
                userId,
                note
            ],
            (err, results) => {
                if (err) {
                    return res.json({ status: "error", message: err })
                }
                return res.json({ status: "ok", message: "Created successfully" })
            }
        )
    } catch (err) {
        return res.json({ status: "error", message: "Create report incorrect" })
    }
})

//update 
reportRoute.put('/report/:id', async (req, res, next) => {
    const { ContractId, reportDate, morWeather, afterWeather, contractSite, reportActivity, reportProblem, worker, userId, note } = req.body
    try {
        dbcofig.query(
            'UPDATE `report` SET `ContractId`=?, `reportDate`=?, `morWeather`=?, `afterWeather`=?, `contractSite`=?, `reportActivity`=?, `reportProblem`=?, `worker`=?, `userId`=?, `note`=? WHERE `reportId`=?',
            [
                ContractId, reportDate, morWeather, afterWeather, contractSite, reportActivity, reportProblem, worker, userId, note, req.params.id
            ],
            (err, results) => {
                if (err) { return res.json({ status: "error", message: err }) }
                return res.json({ status: "ok", message: "Update successfully" })
            }
        )
    } catch (err) {
        return res.json({ status: "error", message: err.message })
    }
})

//Delete
reportRoute.delete('/delete-report/:id', async (req, res, next) => {
    try {
        dbcofig.query('DELETE FROM `report` WHERE reportId=?', [req.params.id],
            function (err, results) {
                if (err) {
                    return res.json({ status: "error", message: err })
                }
                return res.json({ status: "ok", message: `Delete report successfully` })
            }
        )
    } catch (err) {
        return res.json({ status: "error", message: err.message })
    }
})

module.exports = reportRoute;