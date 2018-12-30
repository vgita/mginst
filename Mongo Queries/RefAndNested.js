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


//Q3
db.Employees.aggregate(
    {$lookup: {
        from: "Departments",
        localField: "DepartmentId",
        foreignField: "_id",
        as: "Department"
    }},
    {$unwind: "$Department"},
    {$match: {FullName: "William William"}},
    {$project: {Projects : "$Department.Projects"}}
).pretty()

//Q4

db.Departments.aggregate([
    { $match: {"Name": "IT"}},
    { $project: {Projects: "$Projects"}}
]).pretty()


//Q5

db.Employees.aggregate([
    {$project: {
        _id:1,
        FullName: 1,
        Address: 1,
        NoOfChildren: {$cond: {if: {$isArray: "$Children"}, then: {$size: "$Children"}, else: "NA"}}
    }},
    {$match: {NoOfChildren: {$eq: 2}}}
]).pretty()