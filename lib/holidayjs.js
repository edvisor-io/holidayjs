var path = require('path')
var fs = require('fs')

var HolidayJS = {}

HolidayJS._openCountryData = function(country, cb) {
  var countryFile = path.resolve(__dirname, '../data/' + country.toLowerCase() + '.js')

  fs.exists(countryFile, function(exists) { 
    if (!exists) { 
      return cb('The supplied country (' + country + ') is not supported at this time.')
    } else {
      cb(null, require(countryFile))
    }
  })
}

HolidayJS.calculateHolidays = function(country, year, cb) {
  this._openCountryData(country, function(err, data) {
  })
}

module.exports = HolidayJS