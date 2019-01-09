const recordsHelper = require('./randomRecordsHelper');

let insertDepartments = async function(db,deptNames) {
    try {
        console.log('===>insertDepartments');

     //   let departments = [];

        for (let i = 0; i < deptNames.length; i++) {
            let department = { Name: deptNames[i]};

            let randomGeneratedProjects = recordsHelper.generateProjects(400000, department.Name);

            department.Projects = recordsHelper.getProjects(randomGeneratedProjects,2000);
           // departments.push(department);

            await db.collection('Departments').insertOne(department);
            console.log(`created ${department.Name} collection`);
        }
        //await db.collection('Departments').insertMany(departments);
    
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

            if((i+1) % 100000 == 0) {
                await db.collection('Employees').insertMany(employees);
                console.log(`REF AND NESTED ---==> inserted: ${i}`);

                employees = [];
            }

            if((i+1) % 10000 == 0){
                console.log('Wait...');
            }
        }
      //  await db.collection('Employees').insertMany(employees);
        console.log("Done inserting employees ref and nested documents");

    } catch(e) {
        console.log('ERROR: '+e);
    }
}

module.exports = {
    insertDepartments,
    insertEmployees
}