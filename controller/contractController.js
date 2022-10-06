const express = require('express');
const contractRoute = express.Router();

const dbcofig = require('../config/DB_config')
//Get all
contractRoute.get('/contracts', async (req, res, next) => {
    try {
        dbcofig.execute(
            'SELECT * FROM `contract`', (err, results) => {
                if (err) {
                    console.log(err);
                    return res.json({ status: "error", message: err });
                }
                res.json(results);
            }
        )
    } catch (err) {
        console.log(err);
        return res.json({ status: "error", message: err });
    }
});

//Get by id
contractRoute.get('/contract/:id', async (req, res, next) => {
    try {
        dbcofig.execute(
            'SELECT * FROM `contract` WHERE `ContractId`=?', [req.params.id], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.json({ status: "error", message: err });
                }
                res.json(results);
            }
        )
    } catch (err) {
        console.log(err);
        return res.json({ status: "error", message: err });
    }
});

/* get inner join by id */
contractRoute.get('/join-contract/:id', async (req, res, next) => {
    try {
      dbcofig.execute('SELECT * FROM ((contract INNER JOIN partner ON contract.PartnerId = partner.PartnerId)INNER JOIN company ON contract.CompanyId = company.CompanyId) WHERE `ContractId`=?', [req.params.id], (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ status: "error", message: err });
        }
        res.json(data);
      });
  
    } catch (err) {
      console.log(err);
      return res.json({ status: "error", message: err });
    }
  });

//Post 
contractRoute.post('/contract', async (req, res, next) => {
    const { AuctionId, ReferenceNo, CompanyId, ContractYear, ContractOrder, ContractNo, ContractNoDate, ContractName, Cost, StartDate, EndDate, Duration, InspDate, InspStatus, CloseStatus, AcceptedDate, InsurDuration, InsurEndStatus, InsurEndDate, ModifiedDate, PartnerId, ProgressId, costsumId, Note, contracttypeid, signedstatus } = req.body
    try {
        dbcofig.execute(
            'INSERT INTO `contract`(`AuctionId`, `ReferenceNo`, `CompanyId`, `ContractYear`, `ContractOrder`, `ContractNo`, `ContractNoDate`, `ContractName`, `Cost`, `StartDate`, `EndDate`, `Duration`, `InspDate`, `InspStatus`, `CloseStatus`, `AcceptedDate`, `InsurDuration`, `InsurEndStatus`, `InsurEndDate`, `ModifiedDate`, `PartnerId`, `ProgressId`, `costsumId`, `Note`, `contracttypeid`, `signedstatus`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?)',
            [
                AuctionId, ReferenceNo, CompanyId, ContractYear, ContractOrder, ContractNo, ContractNoDate, ContractName, Cost, StartDate, EndDate, Duration, InspDate, InspStatus, CloseStatus, AcceptedDate, InsurDuration, InsurEndStatus, InsurEndDate, ModifiedDate, PartnerId, ProgressId, costsumId, Note, contracttypeid, signedstatus, 
            ], (err, results) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return;
                }
                res.json({ status: "Register successfully!!" });
            }
        )
    } catch (err) {
        res.json({ status: "error", message: err.message });
    }
})

//Put
contractRoute.put('/contract/:id', async (req, res, next) => {
    try {
        const { AuctionId, ReferenceNo, CompanyId, ContractYear, ContractOrder, ContractNo, ContractNoDate, ContractName, Cost, StartDate, EndDate, Duration, InspDate, InspStatus, CloseStatus, AcceptedDate, InsurDuration, InsurEndStatus, InsurEndDate, ModifiedDate, PartnerId, ProgressId, costsumId, Note, contracttypeid, signedstatus, } = req.body
        dbcofig.execute(
            'UPDATE `contract` SET `AuctionId`=?, `ReferenceNo`=?, `CompanyId`=?, `ContractYear`=?, `ContractOrder`=?, `ContractNo`=?, `ContractNoDate`=?, `ContractName`=?, `Cost`=?, `StartDate`=?, `EndDate`=?, `Duration`=?, `InspDate`=?, `InspStatus`=?, `CloseStatus`=?, `AcceptedDate`=?, `InsurDuration`=?, `InsurEndStatus`=?, `InsurEndDate`=?, `ModifiedDate`=?, `PartnerId`=?, `ProgressId`=?, `costsumId`=?, `Note`=?, `contracttypeid`=?, `signedstatus`=? WHERE `ContractId`=?',
            [
                AuctionId, ReferenceNo, CompanyId, ContractYear, ContractOrder, ContractNo, ContractNoDate, ContractName, Cost, StartDate, EndDate, Duration, InspDate, InspStatus, CloseStatus, AcceptedDate, InsurDuration, InsurEndStatus, InsurEndDate, ModifiedDate, PartnerId, ProgressId, costsumId, Note, contracttypeid, signedstatus, req.params.id
            ], (err, results) => {
                if (err) {
                    res.json({ status: "error", message: err });
                    console.log(err);
                    return;
                }
                res.json({ status: "Update successfully!!" });
            }
        )
    } catch (err) {
        res.json({ status: "error", message: err.message });
    }
})

//Delete
contractRoute.delete('/contract/:id', async (req, res, next) => {
    try {
        dbcofig.execute(
            'DELETE FROM `contract` WHERE ContractId=?', [req.params.id], (err, results) => {
                if (err) { return res.json({ status: "error", message: err.message }); }
                if (results.affectedRows === 0) {
                    return res.json({ status: "error", message: 'No contract with that id' })
                }
                res.json({ status: "Delete successfully" });
            }
        )
    } catch (err) {
        res.json({ status: "error", message: err.message });
    }
})

module.exports = contractRoute;