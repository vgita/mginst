const ObjectID = require('mongodb').ObjectID;
const csvReader = require('./csvReader');

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
        let depIds =  await db.collection('Departments').distinct('_id').then(function (result) {
            return result;
        });

        let employees = [];
        for (let i = 0; i < 10; i++) {
            let namesRand = Math.floor(Math.random() * names.length);
            let addressesRand = Math.floor(Math.random() * addresses.length);
            let depIdRand = Math.floor(Math.random() * depIds.length);

            let x = {
                FullName: names[namesRand] + ' ' + names[namesRand + i],
                Address: addresses[addressesRand],
                DepartmentId: new ObjectID(depIds[depIdRand].toString())
            };
            employees.push(x);
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
        let employeeIds = await  db.collection('Employees').distinct('_id').then(function (result) {
            return result;
        });

        let children = [];
        for (let i = 0; i < 10; i++) {
            let namesRand = Math.floor(Math.random() * names.length);
            let namesRand2 = Math.floor(Math.random() * namesRand);
            let empId = Math.floor(Math.random() * employeeIds.length);

            let x = {
                FullName: names[namesRand] + ' ' + names[namesRand2],
                EmployeeId: new ObjectID(employeeIds[empId].toString())
            };
            children.push(x);
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

        let projects = [];
        for (let i = 0; i < 10; i++) {
            let randomDeptId = Math.floor(Math.random() * departmentIds.length);
            let project = {
                Name: 'Project' + i,
                Description: 'Description' + i,
                Duration: Math.floor(Math.random() * (10 - 4 + 1) + 4),
    
                DepartmentId: new ObjectID(departmentIds[randomDeptId].toString())
            }
            projects.push(project);
    
        }
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