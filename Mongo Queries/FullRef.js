//Q1 Display all details about employees that work in a certain department
    db.Employees.aggregate(
        {$lookup: {
            from: 'Departments',
            localField: 'DepartmentId',
            foreignField: '_id',
            as: 'Department'
        }},
        {$match: {'Department.Name': 'IT'}}
    ).pretty()

//Q2 Display all details about employees that work in a certain
// department in a named project
    db.Employees.aggregate(
        {$lookup: {
            from: 'Departments',
            localField: 'DepartmentId',
            foreignField: '_id',
            as:'Department'
        }},
        {$lookup: {
            from:'WorksOn',
            localField: '_id',
            foreignField: '_id.EmployeeId',
            as: 'WorksOn'
        }},
        {$lookup: {
            from: 'Projects',
            localField: 'WorksOn._id.ProjectId',
            foreignField: '_id',
            as:'Projects'
        }},
        {$match: {$and: [{"Department.Name": "IT"}, {"Projects.Name": " Project 3"}]}}

        ).pretty()

//Q3 Display all details about the projects where an employee is working
    db.Projects.aggregate(
        {$lookup: {
            from: 'WorksOn',
            localField: '_id',
            foreignField: '_id.ProjectId',
            as: 'WorksOn'
        }},
        {$unwind: '$WorksOn'},
        {$lookup: {
            from: 'Employees',
            localField: 'WorksOn._id.EmployeeId',
            foreignField: '_id',
            as: 'Employee'
        }},
        {$unwind: '$Employee'},
        {$match: {'Employee._id': ObjectId('5c291e66d9134140cc3d637a')}}
    ).pretty()
   
    {$project: {Projects : "$Department.Projects"}}

//Q4 Display all details about the projects that run in a named department
        db.Projects.aggregate(
            {$lookup: {
                from: 'Departments',
                localField: 'DepartmentId',
                foreignField: '_id',
                as: 'Department'
            }},
            {$match: {'Department.Name': 'IT'}}
        ).pretty()

//Q5. Display all details of employees who have a certain number of children
db.Employees.aggregate([
    {$lookup: {
        from:'Children',
        localField: '_id',
        foreignField: 'EmployeeId',
        as: 'Children'
    }},
    {$project: {
        _id:1,
        FullName: 1,
        Address: 1,
        NoOfChildren: {$cond: {if: {$isArray: "$Children"}, then: {$size: "$Children"}, else: "NA"}}
    }},
    {$match: {NoOfChildren: {$eq: 2}}}
]).pretty()