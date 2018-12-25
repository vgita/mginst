const csvReader = require('./csvReader');
const ObjectID = require('mongodb').ObjectID;
const recordsHelper = require('./randomRecordsHelper');


let insertEmployees = async function (db) {
    try {
        console.log('FULL NESTED===>insertEmployees');
        let deptNames = await csvReader.getDepartmentNames();
        let names = await csvReader.getNames();
        let addresses = await csvReader.getAddresses();

        let employeeFullName = recordsHelper.getFullName(names);
        let employeeAddress = recordsHelper.getAddress(addresses);

        let randomProjects = recordsHelper.generateProjects(20);

        //look at ref and nested inserts example
        let departments = deptNames.map(departmentName => {
            let department = {
                _id: ObjectID(),
                Name: departmentName,
            };
            return department;
        });


        let employees = [];

        for (let i = 0; i < 30; i++) {
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