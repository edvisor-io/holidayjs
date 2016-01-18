var path = require('path')
var fs = require('fs')
var async = require('async')
var moment = require('moment')
var easterDate = require('./easter')

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
  if (!holidayData.rule.override) {
    return cb('Override setting does not exist.')
  }

  return cb(null, formatHoliday(
    holidayData.name, 
    new Date(holidayData.rule.override + ' ' + year)
  ))
}

var applyGenerator = function(holidayData, year, cb) {
  if (!holidayData.rule.generator) {
    return cb('Generator setting does not exist.')
  }

  if (holidayData.rule.generator.special) {
    return applyGeneratorSpecial(holidayData, year, cb)
  } else {
    return applyGeneratorBasic(holidayData, year, cb)
  }
}

var applyGeneratorBasic = function(holidayData, year, cb) {
  if (!holidayData.rule.generator) {
    return cb('Generator setting does not exist.')
  }

  if (!holidayData.rule.generator.month) {
    return cb('Basic generator setting does not have month set.')
  }

  if (!holidayData.rule.generator.day) {
    return cb('Basic generator setting does not have day rules set.')
  }

  if (!holidayData.rule.generator.day.day) {
    return cb('Basic generator setting does not have day set.')
  }

  if (isNaN(holidayData.rule.generator.day.placement)) {
    return cb('Basic generator setting does not have day placement.')
  }
  
  var date

  if (holidayData.rule.generator.day.placement > 0) {
    date = getNthDayOfMonth(holidayData.rule.generator.day.day, holidayData.rule.generator.day.placement, holidayData.rule.generator.month, year)
  } else {
    date = getLastNthDayOfMonth(holidayData.rule.generator.day.day, holidayData.rule.generator.day.placement, holidayData.rule.generator.month, year)
  }

  applyModifier(date, holidayData.rule.generator.modifier)

  return cb(null, formatHoliday(
    holidayData.name,
    date
  ))
}

var applyGeneratorSpecial = function(holidayData, year, cb) {
  if (!holidayData.rule.generator) {
    return cb('Generator setting does not exist.')
  }

  if (!holidayData.rule.generator.special) {
    return cb('Basic generator setting does not have month set.')
  }
  
  var date

  switch (holidayData.rule.generator.special) {
    case SPECIALS.easter: 
      date = moment(easterDate(year))
      break
  }
  
  applyModifier(date, holidayData.rule.generator.modifier)

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

module.exports = function(dataPath) {
  var HolidayJS = {}

  HolidayJS.openCountryData = function(country, cb) {
    var countryFile = path.resolve(dataPath + '/' + country.toLowerCase() + '.js')

    fs.exists(countryFile, function(exists) { 
      if (!exists) { 
        return cb('The supplied country (' + country + ') is not supported at this time.')
      } else {
        cb(null, require(countryFile))
      }
    })
  }

  HolidayJS.calculateHolidays = function(country, year, cb) {
    var thisObj = this

    this.openCountryData(country, function(err, data) {
      var holidays = []

      async.eachSeries(data, function(holidayData, eachDone) {
        if (holidayData.rule.override) {
          applyOverride(holidayData, year, function(err, holiday) {
            if (err) return eachDone(err)

            holidays.push(holiday)
            return eachDone()
          })
        } else if (holidayData.rule.generator) {
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

  return HolidayJS
}