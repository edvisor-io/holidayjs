var path = require('path')
var fs = require('fs')
var async = require('async')
var moment = require('moment')
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

HolidayJS._formatHoliday = function(name, dateObj) {
  return {
    name: name,
    date: moment(dateObj).format('YYYY-MM-DD')
  }
}

HolidayJS._processOverride = function(holidayData, year, cb) {
  if (!holidayData.override) {
    return cb('Override setting does not exist.')
  }

  return cb(null, this._formatHoliday(
    holidayData.name, 
    new Date(holidayData.override + ' ' + year)
  ))
}

HolidayJS.calculateHolidays = function(country, year, cb) {
  var thisObj = this

  this._openCountryData(country, function(err, data) {
    var holidays = []

    async.eachSeries(data, function(holidayData, eachDone) {
      if (holidayData.override) {
        thisObj._processOverride(holidayData, year, function(err, holiday) {
          if (err) return eachDone(err)

          holidays.push(holiday)
          return eachDone()
        })
      }
    }, function(err) {
      return cb(err, holidays)
    })
  })
}

module.exports = HolidayJS