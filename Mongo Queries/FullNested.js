//Q1
    db.Employees.find({"Department.Name": "IT"}).pretty();

    db.Employees.aggregate([
        {$match: {"Department.Name": "IT"}}
    ]).pretty()

//Q2
    db.Employees.find({$and:[{"Department.Name": "IT"}, {"Department.Projects.Name":"Project 354"}]}).pretty()

    db.Employees.aggregate([
        {$match: {$and: [{"Department.Name": "IT"}, {"Department.Projects.Name": "Project 354"}]}}
]).pretty()

//Q3
    db.Employees.aggregate([
        {$unwind: "$Department"},
        {$match: {FullName: "William William"}},
        {$project: {Projects : "$Department.Projects"}}
    ]).pretty()

//Q4
    db.Employees.aggregate([
        { $unwind: "$Department"},
        { $match: {"Department.Name": "IT"}},
        { $project: {Projects: "$Department.Projects"}}
    ]).pretty()

function x (){
    var deps = ['Executive','Marketing','Finance','Management','IT','Sales','Production','Human Resources'];
    let result = [];

    for(let dep of deps){
        result.push(db.Employees.aggregate([
            { $unwind: "$Department"},
            { $match: {"Department.Name": dep}},
            { $project: {Projects: "$Department.Projects"}}
        ]).toArray().length);
    }
    return result;
}

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