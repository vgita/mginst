const ObjectID = require('mongodb').ObjectID;

let getChildren = function(names, employeeName) {

    let numberOfRecords = generateRandomChildrenNumber();
    let randomIndexes = generateRandomIndexes(names.length, numberOfRecords);

    return randomIndexes.map(randomIndex => {
        return {_id: ObjectID(), 
                FullName: `${names[randomIndex]} ${employeeName}`}
    });
}


let getFullName = function(names) {
    let employeeNameRandomIndex = Math.floor(Math.random() * names.length);

    return `${names[employeeNameRandomIndex]} ${names[names.length-1 - employeeNameRandomIndex]}`;
}

let getAddress = function(addresses) {
    let addressRandomIndex = Math.floor(Math.random() * addresses.length);

    return addresses[addressRandomIndex];
}

let getDepartmentId = function(departmentIds) {
    let departmentIdRandomIndex = Math.floor(Math.random() * departmentIds.length);
    
    return departmentIds[departmentIdRandomIndex];
}

// use to get a random array of projectIds (use to assign random projectIds
// to an employee - refAndNestedInserts)
let getProjectIds = function(projectIds) {
    let numberOfRecords = generateRandomProjectsNumber();

    //use ...new Set to create a new array with unique values
    let randomIndexes =[...new Set(generateRandomIndexes(projectIds.length, numberOfRecords))];

    return randomIndexes.map(randomIndex => {
        return projectIds[randomIndex];
    });
}

let getProjects = function(projects, numberOfRecords) {
   // let numberOfRecords = generateRandomProjectsNumber();
    let randomIndexes = generateRandomIndexes(projects.length, numberOfRecords);

    let randomProjects = randomIndexes.map(randomIndex => {
        return projects[randomIndex]
    });
    
    let uniqueProjects = [];
    let map = new Map();

    for(let project of randomProjects) {
        if(!map.has(project._id)){
            map.set(project._id, true);
            uniqueProjects.push({_id: project._id, 
                Name:`${project.Name}`, 
                Description: `${project.Description}`, 
                Duration: project.Duration});
        }
    }

    return uniqueProjects;
}

//todo: Get project name and description from external source
//     and pass them as parameters
let generateProjects = function(numberOfRecords, deptName = '') {
    let records = [];
    for(let i=0; i < numberOfRecords; i++)
    {
        records.push ({
            _id: ObjectID(),
            Name: `${deptName} Project ${i}`,
            Description: `${deptName} Description ${i}`,
            Duration: Math.floor(Math.random() * (10 - 4 + 1) + 4) 
        });
    }
    return records;
}

let getDepartment = function(departments) {
    let departmentRandomIndex = Math.floor(Math.random() * departments.length);

    return {
        _id: departments[departmentRandomIndex]._id,
        Name: departments[departmentRandomIndex].Name
    };
}


//private

let generateRandomIndexes = function(upperBound, numberOfRecords) {
    let results = [];
    for(let i = 0; i < numberOfRecords; i++) {
        results.push(Math.floor(Math.random() * upperBound));
    }
    return results;
}

let generateRandomChildrenNumber = function() {
    return Math.floor(Math.random() * 4); //number of children of an employee
}

let generateRandomProjectsNumber = function() {
    //employee can be assigned to maximum 3 projects
    return Math.floor(Math.random() * 4); // number of projects an employee is assigned to
   
}

//-------

module.exports = {
    getChildren,
    getProjectIds,
    getProjects,
    generateProjects,
    getFullName,
    getAddress,
    getDepartmentId,
    generateRandomProjectsNumber,
    getDepartment
}