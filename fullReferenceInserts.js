const ObjectID = require('mongodb').ObjectID;
const csvReader = require('./csvReader');
const randomRecordsHelper = require('./randomRecordsHelper');

let insertDepartments = async function (db) {
    try {
        console.log("CALL: insertDepartments");

        let deptNames = csvReader.getDepartmentNames();
        let deps = deptNames.map((name) => ({ Name: name }));

        await db.collection('Departments').insertMany(deps);
    }
    catch (e) {
        console.log("ERROR: " + e);
    }
}
  
let insertEmployees = async function (db) {
    try {
        console.log("CALL: insertEmployees");
        let names = await csvReader.getNames();
        let addresses = await csvReader.getAddresses();
        let departmentIds = await db.collection('Departments').distinct('_id').then(function (result) {
            return result;
        });

        let employees = [];
        for (let i = 0; i < 10; i++) {
            let employee = {
                FullName: randomRecordsHelper.getFullName(names),
                Address: randomRecordsHelper.getAddress(addresses),
                DepartmentId: randomRecordsHelper.getDepartmentId(departmentIds)
            };
            employees.push(employee);
        }

        await db.collection('Employees').insertMany(employees);
    }
    catch (e) {
        console.log("ERROR: " + e);
    }
}
  
let insertChildren = async function (db) {
    try {
        console.log("CALL: insertChildren");

        let names = await csvReader.getNames();
        let employees = await db.collection('Employees').find().toArray();
        let children = [];
       
        for (let employee of employees) {
            let randomChildren = randomRecordsHelper.getChildren(names, employee.FullName.split(' ')[1]);

            var employeesChildren = randomChildren.map(child => {
                return {
                _id : child._id,
                FullName : child.FullName,
                EmployeeId : employee._id
                }
            })

            // use syntax with ... in order to push an array, not just a single item (ES6)
            children.push(...employeesChildren);
        }

        await db.collection('Children').insertMany(children);
    }
    catch (e) {
        console.log("ERROR: " + e)
    }
}
  
let insertProjects = async function (db) {
    try {
        console.log("CALL: insertProjects");

        let departmentIds = await db.collection('Departments').distinct('_id').then(function (result) {
            return result;
        });

        let projects = randomRecordsHelper.generateProjects(20).map((project) => {
            project.DepartmentId = randomRecordsHelper.getDepartmentId(departmentIds);
            return project;
        })
        await db.collection('Projects').insertMany(projects);
    }
    catch (e) {
        console.log("ERROR: " + e);
    }
}
  
let insertWorksOn = async function (db) {
    try {
        console.log("CALL: insertWorksOn");

        let employeeIds = await db.collection('Employees').distinct('_id').then(function (result) {
            return result;
        });
        let projectIds = await db.collection('Projects').distinct('_id').then(function (result) {
            return result;
        });

        let worksOnRecords = [];
        for (let i = 0; i < employeeIds.length; i++) {
            var randomProjectId = Math.floor(Math.random() * projectIds.length);
            let record = {
                _id: {
                    EmployeeId: new ObjectID(employeeIds[i].toString()),
                    ProjectId: new ObjectID(projectIds[randomProjectId].toString())
                },
                WorkingHours: Math.floor(Math.random() * (8 - 3 + 1) + 3)
            }
            worksOnRecords.push(record);
        }
        await db.collection('WorksOn').insertMany(worksOnRecords);
      
        console.log("DONE");
    }
    catch (e) {
        console.log("ERROR: " + e);
    }
}

module.exports = {
    insertDepartments,
    insertEmployees,
    insertChildren,
    insertProjects,
    insertWorksOn
}