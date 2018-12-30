const csvReader = require('./csvReader');
const ObjectID = require('mongodb').ObjectID;
const recordsHelper = require('./randomRecordsHelper');


let insertEmployees = async function (db, numberOfRecords) {
    try {
        console.log('FULL NESTED===>insertEmployees');
        let deptNames = await csvReader.getDepartmentNames();
        let names = await csvReader.getNames();
        let addresses = await csvReader.getAddresses();

        let randomProjects = recordsHelper.generateProjects(1000);

        //look at ref and nested inserts example
        let departments = deptNames.map((departmentName) => ({
            _id: ObjectID(),
            Name: departmentName
        }));

        let employees = [];

        for (let i = 0; i < numberOfRecords; i++) {
            let employeeFullName = recordsHelper.getFullName(names);
            let employeeAddress = recordsHelper.getAddress(addresses);

            let children = await recordsHelper.getChildren(names, employeeFullName.split(' ')[1]);
            let theDept = recordsHelper.getDepartment(departments);
            theDept.Projects =  await recordsHelper.getProjects(randomProjects);
           
            let employee = {
                FullName: employeeFullName,
                Address: employeeAddress,
                Department: theDept,
                Children: children
            }

            employees.push(employee);
        }

        await db.collection('Employees').insertMany(employees);
    } catch (e) {
        console.log('ERROR: ' + e);
    }
}

module.exports = {
    insertEmployees
}