const db = require('./db');
const fullRefereceInserts = require('./fullReferenceInserts');
const refAndNesteInserts = require('./refAndNestedInserts');
const fullNestedInserts = require('./fullNestedInserts');
const csvReader = require('./csvReader');

const fullRefferenceDbName = 'VgitaDis2019FullRefDb';
const refAndNestedDbName = 'VgitaDis2019RefAndNestedDb';
const fullNestedDbName = 'VgitaDis2019FullNestedDb';

let dbNames = [fullRefferenceDbName,refAndNestedDbName,fullNestedDbName ];

let _names;
let _addresses;
let _departments;

(async function() {
    await initDataSources();
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
          await fullRefereceInserts.insertDepartments(theDb, _departments);
  
          await theDb.collection('Employees').deleteMany({});
          await fullRefereceInserts.insertEmployees(theDb, 20000, _names, _addresses);
  
          await theDb.collection('Children').deleteMany({});
          await fullRefereceInserts.insertChildren(theDb, _names);
  
          await theDb.collection('Projects').deleteMany({});
          await fullRefereceInserts.insertProjects(theDb, 1000);
  
          await theDb.collection('WorksOn').deleteMany({});
          await fullRefereceInserts.insertWorksOn(theDb);
        }
        
        if(theDb.databaseName === refAndNestedDbName)
        {
          await theDb.collection('Departments').deleteMany({});
          await refAndNesteInserts.insertDepartments(theDb, 1000, _departments);

          await theDb.collection('Employees').deleteMany({});
          await refAndNesteInserts.insertEmployees(theDb, 10, _names, _addresses);
        }

        if(theDb.databaseName === fullNestedDbName)
        {
          await theDb.collection('Employees').deleteMany({});
          await fullNestedInserts.insertEmployees(theDb, 20, _departments, _names, _addresses);
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



async function initDataSources() {
    _names = await csvReader.getNames();
    _addresses = await csvReader.getAddresses();
    _departments = await csvReader.getDepartmentNames();
}


