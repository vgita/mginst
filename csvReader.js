const fastCsv = require('fast-csv');

let _names = [];
let _addresses = [];

let getNames = async function () {
    if (!_names.length) {
        await fastCsv
            .fromPath('names-copy.csv', { headers: true, delimiter: ',' })
            .on('data', function (data) {
                _names.push(data.name);
            });
    }

    return _names;
};

let getAddresses = async function () {
    if (!_addresses.length) {
        await fastCsv
            .fromPath("addresses-copy.csv", { headers: true, delimiter: "," })
            .on("data", function (data) {
                _addresses.push(
                    "City: " + data.city + ", Street: " + data.street + ", Zip: " + data.zip
                );
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