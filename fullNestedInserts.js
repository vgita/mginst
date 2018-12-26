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

            let departmentRandomIndex = Math.floor(Math.random() * departments.length);
            let children = recordsHelper.getChildren(names, employeeFullName.split(' ')[1]);

            var employee = {
                FullName: employeeFullName,
                Address: employeeAddress,
                Department: departments[departmentRandomIndex],
                Children: children
            }

          //  console.log(employee.Department);
            let randomProjectNumber = recordsHelper.generateRandomProjectsNumber();
            employee.Department.Projects = recordsHelper.getProjects(randomProjects, randomProjectNumber);

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