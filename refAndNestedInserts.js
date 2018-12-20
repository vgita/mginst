const ObjectID = require('mongodb').ObjectID;
const csvReader = require('./csvReader');

let insertDepartments = async function(db) {
    try {
        console.log('===>insertDepartments');
        let deptNames = await csvReader.getDepartmentNames();
        let departments = [];

        for (let i = 0; i < deptNames.length; i++) {
            let department = { Name: deptNames[i], Projects: [] };

            for (let i = 0; i < 5; i++) {
                let project = {
                    _id: ObjectID(),
                    Name: 'Project' + i,
                    Description: 'Description' + i,
                    Duration: Math.floor(Math.random() * (10 - 4 + 1) + 4)
                }
                department.Projects.push(project);
            }

            departments.push(department)
        };
        await db.collection('Departments').insertMany(departments);
       
    } catch(e) {
        console.log('ERROR: '+e);
    }
}

let insertEmployees = async function(db) {
    try {
        console.log('===>insertEmployees');
        let departmentIds = [];
        let projectIds = [];
        let names = await csvReader.getNames();
        let addreses = await csvReader.getAddresses();


        console.log(names);
        console.log(addreses);

    } catch(e) {
        console.log('ERROR: '+e);
    }
}

module.exports = {
    insertDepartments,
    insertEmployees
}