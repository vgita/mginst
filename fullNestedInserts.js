const ObjectID = require('mongodb').ObjectID;
const recordsHelper = require('./randomRecordsHelper');


let insertEmployees = async function (db, numberOfRecords, deptNames, names, addresses) {
    try {
        console.log('FULL NESTED===>insertEmployees');

        //look at ref and nested inserts example
        let departments = await deptNames.map((departmentName) => ({
            _id: ObjectID(),
            Name: departmentName
            //Projects : recordsHelper.generateProjects(50000, departmentName)
        }));

        await departments.forEach((department) => {
            department.Projects = recordsHelper.generateProjects(2000, department.Name );
        })

        let employees = [];

        for (let i = 0; i < numberOfRecords; i++) {

            let employeeFullName = recordsHelper.getFullName(names);
            let employeeAddress = recordsHelper.getAddress(addresses);

            let children = await recordsHelper.getChildren(names, employeeFullName.split(' ')[1]);
            let theDept = recordsHelper.getDepartment(departments);

            let currentDeptProjs = [];
            await departments.forEach( async function(department) {
               
                if(department._id.toString() == theDept._id.toString() && department.Projects.length){
                    let projects = await department.Projects.map(proj => {
                        return proj;
                    });
                    currentDeptProjs.push(...projects);
                }
            }); 

            let numberOfProjects = recordsHelper.generateRandomProjectsNumber();
            theDept.Projects =  await recordsHelper.getProjects(currentDeptProjs,numberOfProjects);
           
            let employee = {
                FullName: employeeFullName,
                Address: employeeAddress,
                Department: theDept,
                Children: children
            }

            employees.push(employee);

        //    console.log(employees.length);

            if((i+1) % 100000 == 0) {
                await db.collection('Employees').insertMany(employees);
                console.log(`FULL NESTED===> inserted: ${i}`);

                employees = [];
            }
            if((i+1) % 10000 == 0){
                console.log('Wait...');
            }

        }

     //   await db.collection('Employees').insertMany(employees);
    } catch (e) {
        console.log('ERROR: ' + e);
    }
}

module.exports = {
    insertEmployees
}