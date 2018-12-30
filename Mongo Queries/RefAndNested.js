//Q1
db.Employees.aggregate(
    {$lookup: {
        from: "Departments",
        localField: "DepartmentId",
        foreignField: "_id",
        as: "Department"
    }},
    {$match: {"Department.Name": "IT"}}
).pretty()

//Q2
db.Employees.aggregate(
    {$lookup: {
        from: "Departments",
        localField: "DepartmentId",
        foreignField: "_id",
        as: "Department"
    }},
    {$match: {$and: [{"Department.Name": "IT"}, {"Department.Projects.Name": "Project 383"}]}}
).pretty()


