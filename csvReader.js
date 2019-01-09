const csv = require('csvtojson');

let _names = [];
let _addresses = [];
let _departments = [];

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
    if (!_departments.length) {
        for (let i = 0; i < 100; i++) {
            _departments.push(`Department ${i + 1}`)
        }
    }

    return _departments;
}

module.exports = {
    getNames,
    getAddresses,
    getDepartmentNames
}