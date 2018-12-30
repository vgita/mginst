const recordsHelper = require('./randomRecordsHelper');

let insertDepartments = async function(db,deptNames) {
    try {
        console.log('===>insertDepartments');

        let departments = [];


        for (let i = 0; i < deptNames.length; i++) {
            let randomGeneratedProjects = recordsHelper.generateProjects(100);
            let department = { Name: deptNames[i]};

           // let randomProjectsNumber = Math.floor(Math.random() * 100)
           //console.log(randomProjectsNumber);
            department.Projects = recordsHelper.getProjects(randomGeneratedProjects, department.Name, 100);
            departments.push(department)
        }
        await db.collection('Departments').insertMany(departments);
    
    } catch(e) {
        console.log('ERROR: '+e);
    }
}

let insertEmployees = async function(db, numberOfRecords, names, addreses) {
    try {
        console.log('===>insertEmployees');
        
        let departments = await db.collection('Departments').find().toArray();
       

        let departmentIds = [];
        departments.forEach(function(item) {
            departmentIds.push(item._id);
        });

        let employees = [];
        for(let i=0; i < numberOfRecords; i++) {

            let fullName = recordsHelper.getFullName(names);
            let departmentId = recordsHelper.getDepartmentId(departmentIds);
            let projectIds = [];
            await departments.forEach( async function(department) {
                if(department._id == departmentId && department.Projects.length){
                    let ids = await department.Projects.map(proj => {
                        return proj._id;
                    });
                    projectIds.push(...ids);
                }
            });

            let employee = {
                FullName : fullName,
                Address : recordsHelper.getAddress(addreses),
                DepartmentId : departmentId,
                Projects : recordsHelper.getProjectIds(projectIds),
                Children : recordsHelper.getChildren(names, fullName.split(' ')[1])
            }

            employees.push(employee);
        }
        await db.collection('Employees').insertMany(employees);
        console.log("Done inserting employees ref and nested documents");

    } catch(e) {
        console.log('ERROR: '+e);
    }
}

module.exports = {
    insertDepartments,
    insertEmployees
}