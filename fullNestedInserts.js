const csvReader = require('./csvReader');

let insertEmployees = async function(db) {
    var deptNames = await csvReader.getDepartmentNames();
    var names = await csvReader.getNames();
    var addresses = await csvReader.getAddresses();

    //look at ref and nested inserts example
    var departments = '';
    var projects = '';

    
}

module.exports = {
    insertEmployees
}