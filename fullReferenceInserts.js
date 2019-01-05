const ObjectID = require('mongodb').ObjectID;
const randomRecordsHelper = require('./randomRecordsHelper');

let insertDepartments = async function (db, deptNames) {
    try {
        console.log("CALL: insertDepartments");

        let deps = deptNames.map((name) => ({ Name: name }));

        await db.collection('Departments').insertMany(deps);
    }
    catch (e) {
        console.log("ERROR: " + e);
    }
}
  
let insertEmployees = async function (db, numberOfRecords, names, addresses) {
    try {
        console.log("CALL: insertEmployees");
        let departmentIds = await db.collection('Departments').distinct('_id').then(function (result) {
            return result;
        });

        let employees = [];
        for (let i = 0; i < numberOfRecords; i++) {
            let employee = {
                FullName: randomRecordsHelper.getFullName(names),
                Address: randomRecordsHelper.getAddress(addresses),
                DepartmentId: randomRecordsHelper.getDepartmentId(departmentIds)
            };
            employees.push(employee);

            if((i+1) % 100000 == 0) {
                await db.collection('Employees').insertMany(employees);
                console.log(`inserted: ${i}`);

                employees = [];
            }
        }

        //await db.collection('Employees').insertMany(employees);
        console.log('Done insertign')
    }
    catch (e) {
        console.log("ERROR: " + e);
    }
}
  
let insertChildren = async function (db, names) {
    try {
        console.log("CALL: insertChildren");

        let n = 0;
        let limit = await db.collection('Employees').countDocuments();
        while(n <= limit)
        {
            let employees = [];
            let children = [];

            employees = await db.collection('Employees').find().skip(n).limit(10000).toArray();
       
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
            n += 10000;
        }

       // let employees = await db.collection('Employees').find({"_id": true, "FullName": true}).toArray();
        

       // await db.collection('Children').insertMany(children);
    }
    catch (e) {
        console.log("ERROR: " + e)
    }
}
  
let insertProjects = async function (db, numberOfRecords) {
    try {
        console.log("CALL: insertProjects");

        let departmentIds = await db.collection('Departments').distinct('_id').then(function (result) {
            return result;
        });

        let projects = randomRecordsHelper.generateProjects(numberOfRecords).map((project) => {
            project.DepartmentId = randomRecordsHelper.getDepartmentId(departmentIds);
            return project;
        })
        await db.collection('Projects').insertMany(projects);
    }
    catch (e) {
        console.log("ERROR: " + e);
    }
}
  
// let insertWorksOn = async function (db) {
//     try {
//         console.log("CALL: insertWorksOn");

//         let employeeIds = await db.collection('Employees').distinct('_id').then(function (result) {
//             //do not use all employees
//             //there should be employees that are not assigned to projects and projects
//             //that are not started
//             return result.slice(Math.floor(result.length - result.length * 0.98));
//         });
//         let projectIds = await db.collection('Projects').distinct('_id').then(function (result) {
//             return result;
//         });

//         let worksOnRecords = [];
//         for (let i = 0; i < projectIds.length; i++) {
//             // 8-0 persons can work at a project
//             let randomWorkersNumber =  Math.floor(Math.random() * 9)

//             let projectWorkers = [];

//             for (let j = 0; j < randomWorkersNumber; j++) {
//                 let randomEmployeeId = Math.abs(Math.floor(Math.random() * employeeIds.length));
//                 let record = {
//                     _id: {
//                         EmployeeId: new ObjectID(employeeIds[randomEmployeeId].toString()),
//                         ProjectId: new ObjectID(projectIds[i].toString())
//                     },
//                     WorkingHours: Math.floor(Math.random() * (8 - 3 + 1) + 3)
//                 }

//                 //avoid inserting duplicates
//                 let alreadyInsertd = await projectWorkers.some(elm => {
//                     return elm._id.EmployeeId.toString() == record._id.EmployeeId.toString();
//                 })

//                 if (!alreadyInsertd) {
//                     projectWorkers.push(record);
//                 }
//             }
//             worksOnRecords.push(...projectWorkers);

//         }
//         await db.collection('WorksOn').insertMany(worksOnRecords, { continueOnError: true, safe: true });

//         console.log("DONE");
//     }
//     catch (e) {
//         console.log("ERROR: " + e);
//     }
// }

let insertWorksOn = async function(db){
    try{
        console.log("CALL: insertWorksOn");
        let projects = await db.collection('Projects').find().toArray();

        let n = 0;
        let limit = await db.collection('Employees').countDocuments();
        while(n <= limit)
        {
            let worksOnRecords = [];
            let employees = [];
            employees = await db.collection('Employees').find().skip(n).limit(100000).toArray();
            for(var employee of employees) {
                let randomProjectsNumber = randomRecordsHelper.generateRandomProjectsNumber();

                let employeeProjects = [];
                while(randomProjectsNumber > 0){
                    let randomProjectIndex = await getRightProjectIndexForEmployee(projects, Math.abs(Math.floor(Math.random() * projects.length)), employee.DepartmentId)

                    if(employee.DepartmentId.toString() == projects[randomProjectIndex].DepartmentId.toString()) {
                        let record = {
                            _id: {
                                EmployeeId: new ObjectID(employee._id.toString()),
                                ProjectId: new ObjectID(projects[randomProjectIndex]._id.toString())
                            },
                            WorkingHours: Math.floor(Math.random() * (8 - 3 + 1) + 3)
                        };

                        //avoid inserting duplicates
                        let alreadyInsertd = await employeeProjects.some(elm => {
                            return elm._id.ProjectId.toString() == record._id.ProjectId.toString();
                        });

                        if (!alreadyInsertd) {
                            employeeProjects.push(record);
                        };
                    }
                    randomProjectsNumber--;
                }
                worksOnRecords.push(...employeeProjects);
            }

            if(worksOnRecords.length){
                await db.collection('WorksOn').insertMany(worksOnRecords);
            }
            console.log('DONE firts '+n+' employees');
            n += 100000;
        }
        console.log("DONE");


        // let employees =  await db.collection('Employees').find().toArray();
        // let projects = await db.collection('Projects').find().toArray();

        // let worksOnRecords = [];

        // for(let project of projects)
        // {
        //     // 8-0 persons can work at a project
        //     let randomWorkersNumber =  Math.floor(Math.random() * 9);
        //     let projectWorkers = [];
        //     while(randomWorkersNumber > 0)
        //     {
        //         let randomEmployeeIndex = Math.abs(Math.floor(Math.random() * employees.length));
        //         if (employees[randomEmployeeIndex].DepartmentId.toString() == project.DepartmentId.toString()) {
        //             let record = {
        //                 _id: {
        //                     EmployeeId: new ObjectID(employees[randomEmployeeIndex]._id.toString()),
        //                     ProjectId: new ObjectID(project._id.toString())
        //                 },
        //                 WorkingHours: Math.floor(Math.random() * (8 - 3 + 1) + 3)
        //             }

        //             //avoid inserting duplicates
        //             let alreadyInsertd = await projectWorkers.some(elm => {
        //                 return elm._id.EmployeeId.toString() == record._id.EmployeeId.toString();
        //             })

        //             if (!alreadyInsertd) {
        //                 projectWorkers.push(record);
        //             }

        //             randomWorkersNumber--;
        //         }
        //     }
        //     worksOnRecords.push(...projectWorkers);
        // }

        // await db.collection('WorksOn').insertMany(worksOnRecords);
        // console.log("DONE");
    }
    catch (e) {
        console.log("ERROR: " + e);
    }
}

var getRightProjectIndexForEmployee = function(projects, index, departmentId)
{
    if(projects[index].DepartmentId.toString() == departmentId.toString()) {
        return index;
    } else {
       return getRightProjectIndexForEmployee(projects,Math.abs(Math.floor(Math.random() * projects.length)),departmentId)
    }
}

module.exports = {
    insertDepartments,
    insertEmployees,
    insertChildren,
    insertProjects,
    insertWorksOn
}