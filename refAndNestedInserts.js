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
        let departmentIds = await db.collection('Departments').distinct('_id').then(function (result) {
            return result;
        });

        let projectIds = await db.collection('Departments').distinct('Projects._id').then(function (result) {
            return result;
        });

        let names = await csvReader.getNames();
        let addreses = await csvReader.getAddresses();


        let employees = [];
        for(let i=0; i < 10; i++) {
            let employeeNameRandomIndex = Math.floor(Math.random() * names.length);
            let employeeAddressRandomIndex = Math.floor(Math.random() * addreses.length);
            let departmentIdRandomIndex = Math.floor(Math.random() * departmentIds.length);

            //employee can be assigned to maximum 3 projects
            let randomProjectsNumber = Math.floor(Math.random() * 4); // number of projects an employee is assigned to
            let projectIdRandomIndexes = function() {
                let result =[];
                 for(let i=0; i < randomProjectsNumber; i++) {
                    result.push(Math.floor(Math.random() * projectIds.length));
                }

                return result;
            }

             //employee can have maximum 3 children
            let randomChildrenNumber = Math.floor(Math.random() * 4); //number of children of an employee
            let childrenNameRandomIndex = function() {
                let result = [];
                for(let i =0 ;i < randomChildrenNumber; i++) {
                    result.push(Math.floor(Math.random() * names.length));
                }

                return result;
            }

            let employee = {
                FullName : `${names[employeeNameRandomIndex]} ${names[names.length - employeeNameRandomIndex - 1]}`,
                Address : addreses[employeeAddressRandomIndex],
                DepartmentId : departmentIds[departmentIdRandomIndex],
                Projects :projectIdRandomIndexes().map(randomIndex => {
                    return projectIds[randomIndex];
                }),
                Children : childrenNameRandomIndex().map(randomIndex => {
                    return {_id: ObjectID() , FullName: `${names[randomIndex]} ${names[names.length - employeeNameRandomIndex - 1]}` }
                })
    
            }

            employees.push(employee);
        }
        await db.collection('Employees').insertMany(employees);
        console.log("Done inserting employees ref and nested documents");
        // console.log(names);
        // console.log(addreses);
        // console.log('Dept ids:::::: >>> ');
        // console.log(departmentIds);

        // console.log('Projs ids :::::::: >>>');
        // console.log(projectIds);

    } catch(e) {
        console.log('ERROR: '+e);
    }
}

module.exports = {
    insertDepartments,
    insertEmployees
}