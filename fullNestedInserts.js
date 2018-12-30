const ObjectID = require('mongodb').ObjectID;
const recordsHelper = require('./randomRecordsHelper');


let insertEmployees = async function (db, numberOfRecords, deptNames, names, addresses) {
    try {
        console.log('FULL NESTED===>insertEmployees');

        //look at ref and nested inserts example
        let departments = deptNames.map((departmentName) => ({
            _id: ObjectID(),
            Name: departmentName,
            Projects : recordsHelper.generateProjects(100, departmentName)
        }));

        let employees = [];

        for (let i = 0; i < numberOfRecords; i++) {
            let employeeFullName = recordsHelper.getFullName(names);
            let employeeAddress = recordsHelper.getAddress(addresses);

            let children = await recordsHelper.getChildren(names, employeeFullName.split(' ')[1]);
            let theDept = recordsHelper.getDepartment(departments);

            let currentDeptProjs = [];
            await departments.forEach( async function(department) {
                if(department._id == theDept._id && department.Projects.length){
                    let projects = await department.Projects.map(proj => {
                        return proj;
                    });
                    console.log(projects);
                    currentDeptProjs.push(...projects);
                }
            }); 

            console.log(currentDeptProjs);

            theDept.Projects =  await recordsHelper.getProjects(currentDeptProjs);
           
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