const csv = require('csvtojson');

let _names = [];
let _addresses = [];

// let getNames = function () {
//     if (!_names.length) {
//          fastCsv
//             .fromPath('names-copy.csv', { headers: true, delimiter: ',' })
//             .on('data', function (data) {
//                 _names.push(data.name);
//             });
//     }

//     return _names;
// };

let getNames = function() {
    if(!_names.length) {
        _names = csv()
            .fromFile('names-copy.csv')
            .then((jsonObj) => {
                return jsonObj.map(data => {
                    return data.name;
                });
            });
    }

    return _names;
}

// let getAddresses = async  function () {
//     if (!_addresses.length) {
//         await fastCsv
//             .fromPath('addresses-copy.csv', { headers: true, delimiter: ',' })
//             .on('data', function (data) {
//                 _addresses.push(
//                     'City: ' + data.city + ', Street: ' + data.street + ', Zip: ' + data.zip
//                 );
//             });
//     }
//     return _addresses;
// };

let getAddresses = async function () {
    if (!_addresses.length) {
        _addresses = csv()
            .fromFile('addresses-copy.csv')
            .then((jsonObj) => {
                return jsonObj.map(data => {
                    return 'City: ' + data.city + ', Street: ' + data.street + ', Zip: ' + data.zip;
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