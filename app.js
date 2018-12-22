const db = require('./db');
const fullRefereceInserts = require('./fullReferenceInserts');
const refAndNesteInserts = require('./refAndNestedInserts');

const fullRefferenceDbName = 'FullRefDb';
const refAndNestedDbName = 'RefAndNestedDb';
const fullNestedDbName = 'FullNestedDb';

let dbNames = [fullRefferenceDbName,refAndNestedDbName,fullNestedDbName ];

(function() {
    dbNames.forEach(dbName => {
      createDb(dbName);
    });
})();

function createDb (dbName) {
  try {
    db.initDb((err, db) => {
      if (err) {
        console.log(err);
      } else {
        'Db connection initialied'
      }
    }, dbName).then(async function () {
      try {
        var theDb = db.getDb();
        console.log(theDb.databaseName);
        //--------===> FULL REFERENCES DB
        if(theDb.databaseName === fullRefferenceDbName )
        {
          await theDb.collection('Departments').deleteMany({});
          await fullRefereceInserts.insertDepartments(theDb);
  
          await theDb.collection('Employees').deleteMany({});
          await fullRefereceInserts.insertEmployees(theDb);
  
          await theDb.collection('Children').deleteMany({});
          await fullRefereceInserts.insertChildren(theDb);
  
          await theDb.collection('Projects').deleteMany({});
          await fullRefereceInserts.insertProjects(theDb);
  
          await theDb.collection('WorksOn').deleteMany({});
          await fullRefereceInserts.insertWorksOn(theDb);
        }
        
        if(theDb.databaseName === refAndNestedDbName)
        {
          await theDb.collection('Departments').deleteMany({});
          await refAndNesteInserts.insertDepartments(theDb);

          await theDb.collection('Employees').deleteMany({});
          await refAndNesteInserts.insertEmployees(theDb);
        }

        if(theDb.databaseName === fullNestedDbName)
        {
         // console.log(fullNestedDbName+' not implementd')
        }
        //----------------//-----------------------//
      }
      catch (e) {
        console.log("ERROR: " + e);
      }
    });

  } catch (e) {
    console.log(e);
  }
};

