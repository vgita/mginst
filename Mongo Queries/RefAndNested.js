//Q1
db.Employees.aggregate([
    {$lookup: {
        from: "Departments",
        localField: "DepartmentId",
        foreignField: "_id",
        as: "Department"
    }},
    {$match: {"Department.Name": "IT"}},
    {$project: {FullName : "$FullName", DepartmentId:"$DepartmentId", Address:"$Address"}}]
).pretty()

db.Employees.explain("executionStats").aggregate([
    {$lookup: {
        from: "Departments",
        localField: "DepartmentId",
        foreignField: "_id",
        as: "Department"
    }},
    {$match: {"Department.Name": "IT"}},
    {$project: {FullName : "$FullName", DepartmentId:"$DepartmentId", Address:"$Address"}}]
)

//Q2
db.Employees.aggregate(
    {$lookup: {
        from: "Departments",
        localField: "DepartmentId",
        foreignField: "_id",
        as: "Department"
    }},
    {$match: {$and: [{"Department.Name": "IT"}, {"Projects": ObjectId("5c30a0bd2aff441ffcd8cb61")}]}},
    {$project: {FullName : "$FullName", DepartmentId:"$DepartmentId", Address:"$Address"}}
).pretty()

db.Departments.aggregate([
	{$unwind: "$Projects"},
	{$project: {DepartmentId: "$_id", DepartmentName: "$Name", 
	    "ProjectId": "$Projects._id", "ProjectName": "$Projects.Name"}},
	{$graphLookup: {
 	from: "Employees",
 	startWith: "$ProjectId",
 	connectFromField: "ProjectId",
 	connectToField: "Projects",
    as: 'Emps'
 }},
 {$match: {$and: [{"DepartmentName": "Department 1"}, {"ProjectName": "Department 1 Project 148844"}]}}
 ])


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

db.Departments.aggregate([
	{$unwind: "$Projects"},
	{$project: {DepartmentId: "$_id", DepartmentName: "$Name", 
	    "ProjectId": "$Projects._id", "ProjectName": "$Projects.Name"}},
	{$graphLookup: {
 	from: "Employees",
 	startWith: "$ProjectId",
 	connectFromField: "ProjectId",
 	connectToField: "Projects",
    as: 'Emps'
 }},
 {$unwind: "$Emps"},
 {$match:{"Emps.FullName": "Sebastian Nealy"}}
 ])

//Q4

db.Departments.aggregate([
    { $match: {"Name": "IT"}},
    { $project: {Projects: "$Projects"}}
]).pretty()

db.Departments.aggregate([
    { $match: {"Name": "Department 1"}},
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