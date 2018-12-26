const csvReader = require('./csvReader');
const recordsHelper = require('./randomRecordsHelper');

let insertDepartments = async function(db, maxNumberOfProjectsPerDepartment) {
    try {
        console.log('===>insertDepartments');

        let deptNames = await csvReader.getDepartmentNames();
        let departments = [];

        let randomGeneratedProjects = recordsHelper.generateProjects(maxNumberOfProjectsPerDepartment);

        for (let i = 0; i < deptNames.length; i++) {
            let department = { Name: deptNames[i]};

            let randomProjectsNumber = Math.floor(Math.random() * maxNumberOfProjectsPerDepartment)
           console.log(randomProjectsNumber);
            department.Projects = recordsHelper.getProjects(randomGeneratedProjects, randomProjectsNumber);
            departments.push(department)
        }
        await db.collection('Departments').insertMany(departments);
    
    } catch(e) {
        console.log('ERROR: '+e);
    }
}

let insertEmployees = async function(db, numberOfRecords) {
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
        //Insert x employees
        for(let i=0; i < numberOfRecords; i++) {

            let fullName = recordsHelper.getFullName(names);

            let employee = {
                FullName : fullName,
                Address : recordsHelper.getAddress(addreses),
                DepartmentId : recordsHelper.getDepartmentId(departmentIds),
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