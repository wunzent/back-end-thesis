const ReportAPI = require('../controller/reportController')
const PartnerAPI = require('../controller/partnerController')
const ContractAPI = require('../controller/contractController')
const CompanyAPI = require('../controller/companyController')
const UploadImageAPI = require('../controller/uploadImageController')
const Login = require('../controller/LoginController')

module.exports = (app) => {
    app.use(Login),
    app.use(ReportAPI);
    app.use(PartnerAPI);
    app.use(ContractAPI);
    app.use(CompanyAPI);
    app.use(UploadImageAPI);

}

