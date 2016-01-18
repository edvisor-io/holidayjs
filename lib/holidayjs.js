var path = require('path')
var fs = require('fs')
var async = require('async')
var moment = require('moment')
var easterDate = require('./easter')
var HolidayJS = {}

var DAY_OF_WEEK = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5, 
  saturday: 6
}

var SPECIALS = {
  easter: '%EASTER'
}

var formatHoliday = function(name, dateObj) {
  return {
    name: name,
    date: moment(dateObj).format('YYYY-MM-DD')
  }
}

var applyOverride = function(holidayData, year, cb) {
  if (!holidayData.override) {
    return cb('Override setting does not exist.')
  }

  return cb(null, formatHoliday(
    holidayData.name, 
    new Date(holidayData.override + ' ' + year)
  ))
}

var applyGenerator = function(holidayData, year, cb) {
  if (!holidayData.generator) {
    return cb('Generator setting does not exist.')
  }

  if (holidayData.generator.special) {
    return applyGeneratorSpecial(holidayData, year, cb)
  } else {
    return applyGeneratorBasic(holidayData, year, cb)
  }
}

var applyGeneratorBasic = function(holidayData, year, cb) {
  if (!holidayData.generator) {
    return cb('Generator setting does not exist.')
  }

  if (!holidayData.generator.month) {
    return cb('Basic generator setting does not have month set.')
  }

  if (!holidayData.generator.day) {
    return cb('Basic generator setting does not have day rules set.')
  }

  if (!holidayData.generator.day.day) {
    return cb('Basic generator setting does not have day set.')
  }

  if (isNaN(holidayData.generator.day.placement)) {
    return cb('Basic generator setting does not have day placement.')
  }
  
  var date

  if (holidayData.generator.day.placement > 0) {
    date = getNthDayOfMonth(holidayData.generator.day.day, holidayData.generator.day.placement, holidayData.generator.month, year)
  } else {
    date = getLastNthDayOfMonth(holidayData.generator.day.day, holidayData.generator.day.placement, holidayData.generator.month, year)
  }

  applyModifier(date, holidayData.generator.modifier)

  return cb(null, formatHoliday(
    holidayData.name,
    date
  ))
}

var applyGeneratorSpecial = function(holidayData, year, cb) {
  if (!holidayData.generator) {
    return cb('Generator setting does not exist.')
  }

  if (!holidayData.generator.special) {
    return cb('Basic generator setting does not have month set.')
  }
  
  var date

  switch (holidayData.generator.special) {
    case SPECIALS.easter: 
      date = moment(easterDate(year))
      break
  }
  
  applyModifier(date, holidayData.generator.modifier)

  return cb(null, formatHoliday(
    holidayData.name,
    date
  ))
  easterDate
}

var applyModifier = function(date, modifier) {
  var modifierParts

  if (modifier) {
    modifierParts = modifier.split(" ")
    date.add(modifierParts[0], modifierParts[1])
  }

  return date
}

var getNthDayOfMonth = function(day, placement, month, year) {
  if (placement <= 0) {
    throw new Error('placement must be a positive integer')
  }

  var date = moment(new Date(month + ' ' + year)).startOf('month');
  var holidayDataDay = DAY_OF_WEEK[day.toLowerCase()]

  //if the start of the month is not the right day...
  if (date.day() !== holidayDataDay) {
    date.add((7 - (date.day() - holidayDataDay)) + (7 * (placement - 1)), 'day')
  } else {
    date.add(7 * (placement - 1), 'day')
  }

  //if the month has now changed, roll back to last correct day of the month
  if (date.format('MMMM').toLowerCase() !== month.toLowerCase()) {
    return getLastNthDayOfMonth(day, -1, month, year)
  }

  return date
}

var getLastNthDayOfMonth = function(day, placement, month, year) {
  if (placement >= 0) {
    throw new Error('placement must be a negative integer')
  }

  var date = moment(new Date(month + ' ' + year)).endOf('month');
  var holidayDataDay = DAY_OF_WEEK[day.toLowerCase()]

  //if the end of the month is not the right day...
  if (date.day() !== holidayDataDay) {
    date.subtract((date.day() - holidayDataDay) + (7 * ((-1 * placement) - 1)), 'day')
  } else {
    date.subtract(7 * (placement - 1), 'day')
  }

  //if the month has now changed, roll forward to the first correct day of the month
  if (date.format('MMMM').toLowerCase() !== month.toLowerCase()) {
    return getNthDayOfMonth(day, 1, month, year)
  }

  return date
}

var openCountryData = function(country, cb) {
  var countryFile = path.resolve(__dirname, '../data/' + country.toLowerCase() + '.js')

  fs.exists(countryFile, function(exists) { 
    if (!exists) { 
      return cb('The supplied country (' + country + ') is not supported at this time.')
    } else {
      cb(null, require(countryFile))
    }
  })
}

var calculateHolidays = function(country, year, cb) {
  var thisObj = this

  this.openCountryData(country, function(err, data) {
    var holidays = []

    async.eachSeries(data, function(holidayData, eachDone) {
      if (holidayData.override) {
        applyOverride(holidayData, year, function(err, holiday) {
          if (err) return eachDone(err)

          holidays.push(holiday)
          return eachDone()
        })
      } else if (holidayData.generator) {
        applyGenerator(holidayData, year, function(err, holiday) {
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

HolidayJS.openCountryData = openCountryData
HolidayJS.calculateHolidays = calculateHolidays

module.exports = HolidayJS