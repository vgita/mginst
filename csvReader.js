const csv = require('csvtojson');

let _names = [];
let _addresses = [];

let getNames = function() {
    if(!_names.length) {
        _names = csv()
            .fromFile("..\\names.csv")
            .then((jsonObj) => {
                return jsonObj.map(data => {
                    return data.name;
                });
            });
    }
    return _names;
}

let getAddresses = async function () {
    if (!_addresses.length) {
        _addresses = csv()
            .fromFile('..\\addresses.csv')
            .then((jsonObj) => {
                return jsonObj.map(data => {
                    return {City:  data.city , Street: data.street , Zip: data.zip};
                });
            });
    }
    return _addresses;
};

let getDepartmentNames = function() {
    return ['Executive','Marketing','Finance','Management','IT','Sales','Production','Human Resources'];
}

module.exports = {
    getNames,
    getAddresses,
    getDepartmentNames
}