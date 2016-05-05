var path = require('path')

describe('HolidayJS', function() {
  
  describe('Accessing data files', function() {
    var holidayjs

    beforeEach(function(){
      holidayjs = require('../../lib/holidayjs')(path.resolve(__dirname, '../../data'))
    })

    it('should open the appropriate country data file', function(done) {
      holidayjs.openCountryData('test', function(err, data) {
        expect(data).not.toBe(null);
        expect(data).not.toBe(undefined);
        expect(data instanceof Array).toBe(true);

        done()
      })
    })

    it('should error if the country data file is not found', function(done) {
      holidayjs.openCountryData('fake', function(err, data) {
        expect(data).toBe(undefined);
        expect(err).not.toBe(null);

        done()
      })
    })

    it('should force country code to lowercase', function(done) {
      holidayjs.openCountryData('TEST', function(err, data) {
        expect(data).not.toBe(null);
        expect(data).not.toBe(undefined);
        expect(data instanceof Array).toBe(true);

        done()
      })
    })
  })

  describe('Override rule', function() {
    it('should generate holidays off the override rule', function(done) {
      var holidayjs = require('../../lib/holidayjs')('')
      var overrideRuleHoliday = [{
        name: 'Override holiday',
        rule: {
          override: 'January 5'
        }
      }]

      spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
        cb(null, overrideRuleHoliday)
      });

      holidayjs.calculateHolidays('ca', 2015, function(err, holidays) {

        expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
        expect(holidays[0].date).toBe('2015-01-05')
        done()
      })
    })
  })
  

  describe('Generator rule', function() {
    describe('Day and month without modifier', function() {
      it('should generate holiday', function(done) {
        var holidayjs = require('../../lib/holidayjs')('')
        var overrideRuleHoliday = [{
          name: 'First monday of September',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: 1
              },
              month: 'September'
            }
          }
        }, {
          name: 'Second monday of September',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: 2
              },
              month: 'September'
            }
          }
        }, {
          name: 'Third monday of September',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: 3
              },
              month: 'September'
            }
          }
        }, {
          name: 'Fourth monday of September',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: 4
              },
              month: 'September'
            }
          }
        }, {
          name: 'Last monday of September',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: -1
              },
              month: 'September'
            }
          }
        }, {
          name: 'Second-last monday of September',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: -2
              },
              month: 'September'
            }
          }
        }, {
          name: 'Third-last monday of September',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: -3
              },
              month: 'September'
            }
          }
        }, {
          name: 'Fourth-last monday of September',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: -4
              },
              month: 'September'
            }
          }
        }]

        spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
          cb(null, overrideRuleHoliday)
        });

        holidayjs.calculateHolidays('ca', 2015, function(err, holidays) {

          expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
          expect(holidays[0].date).toBe('2015-09-07')

          expect(holidays[1].name).toBe(overrideRuleHoliday[1].name)
          expect(holidays[1].date).toBe('2015-09-14')

          expect(holidays[2].name).toBe(overrideRuleHoliday[2].name)
          expect(holidays[2].date).toBe('2015-09-21')

          expect(holidays[3].name).toBe(overrideRuleHoliday[3].name)
          expect(holidays[3].date).toBe('2015-09-28')

          expect(holidays[4].name).toBe(overrideRuleHoliday[4].name)
          expect(holidays[4].date).toBe('2015-09-28')

          expect(holidays[5].name).toBe(overrideRuleHoliday[5].name)
          expect(holidays[5].date).toBe('2015-09-21')

          expect(holidays[6].name).toBe(overrideRuleHoliday[6].name)
          expect(holidays[6].date).toBe('2015-09-14')

          expect(holidays[7].name).toBe(overrideRuleHoliday[7].name)
          expect(holidays[7].date).toBe('2015-09-07')

          done()
        })
      })

      it('will calculate first last thirsday of November 2016', function(done) {
        var holidayjs = require('../../lib/holidayjs')('')
        var overrideRuleHoliday = [{
          name: "Some Day",
          rule: {
            generator: {
              day: {
                day: 'Thursday',
                placement: -1
              },
              month: 'November'
            }
          } 
        }]

        spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
          cb(null, overrideRuleHoliday)
        });

        holidayjs.calculateHolidays('ca', 2016, function(err, holidays) {
          expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
          expect(holidays[0].date).toBe('2016-11-24')
          done()
        })
      })

      it('will push to following weekday if lands on a weekend', function(done) {
        var holidayjs = require('../../lib/holidayjs')('')
        var overrideRuleHoliday = [{
          name: "Some Day",
          rule: {
            override: 'November 27',
            ifWeekend: {
              pushTo: 'Monday'
            }
          } 
        }]

        spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
          cb(null, overrideRuleHoliday)
        });

        holidayjs.calculateHolidays('ca', 2016, function(err, holidays) {
          expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
          expect(holidays[0].date).toBe('2016-11-28')
          done()
        })
      })
    })

    describe('American Thanksgiving', function() {
      it('will calculate american thanksgiving properly', function(done) {
        var holidayjs = require('../../lib/holidayjs')('')
        var overrideRuleHoliday = [{
          name: "Thanksgiving Day",
          rule: {
            generator: {
              day: {
                day: 'Thursday',
                placement: 4
              },
              month: 'November'
            }
          } 
        }]

        spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
          cb(null, overrideRuleHoliday)
        });

        holidayjs.calculateHolidays('ca', 2016, function(err, holidays) {
          expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
          expect(holidays[0].date).toBe('2016-11-24')
          done()
        })
      })
    });

    describe('Day and month with modifier', function() {
      it('will apply positive or negative day modifier', function(done) {
        var holidayjs = require('../../lib/holidayjs')('')
        var overrideRuleHoliday = [{
          name: 'Holiday 3 days after first monday in september',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: 1
              },
              month: 'September',
              modifier: '+3 days'
            }
          }
        }]

        spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
          cb(null, overrideRuleHoliday)
        });

        holidayjs.calculateHolidays('ca', 2015, function(err, holidays) {
          expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
          expect(holidays[0].date).toBe('2015-09-10')
          done()
        })
      })

      it('will apply positive or negative week modifier', function(done) {
        var holidayjs = require('../../lib/holidayjs')('')
        var overrideRuleHoliday = [{
          name: 'Holiday 3 days after first monday in september',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: 1
              },
              month: 'September',
              modifier: '+1 week'
            }
          }
        }]

        spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
          cb(null, overrideRuleHoliday)
        });

        holidayjs.calculateHolidays('ca', 2015, function(err, holidays) {
          expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
          expect(holidays[0].date).toBe('2015-09-14')
          done()
        })
      })

      it('will apply positive or negative month modifier', function(done) {
        var holidayjs = require('../../lib/holidayjs')('')
        var overrideRuleHoliday = [{
          name: 'Holiday 3 days after first monday in september',
          rule: {
            generator: {
              day: {
                day: 'Monday',
                placement: 1
              },
              month: 'September',
              modifier: '+1 month'
            }
          }
        }]

        spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
          cb(null, overrideRuleHoliday)
        });

        holidayjs.calculateHolidays('ca', 2015, function(err, holidays) {
          expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
          expect(holidays[0].date).toBe('2015-10-07')
          done()
        })
      })
    })

    describe('Special date with modifier', function() {
      it('will set date relative to easter', function(done) {
        var holidayjs = require('../../lib/holidayjs')('')
        var overrideRuleHoliday = [{
          name: 'Good Friday',
          rule: {
            generator: {
              special: '%EASTER',
              modifier: '-2 days'
            }
          }
        }]

        spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
          cb(null, overrideRuleHoliday)
        });

        holidayjs.calculateHolidays('ca', 2015, function(err, holidays) {
          expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
          expect(holidays[0].date).toBe('2015-04-03')
          done()
        })
      })
    })

    describe('Victoria Day', function() {
      it('will calculate the last Monday before May 25th', function(done) {
        var holidayjs = require('../../lib/holidayjs')('')
        var overrideRuleHoliday = [{
          name: 'Victoria Day',
          rule: {
            generator: {
              month: 'May',
              date: 25,
              day: {
                day: 'Monday',
                placement: -1
              }
            }
          }
        }]

        spyOn(holidayjs, 'openCountryData').and.callFake(function(country, cb) {
          cb(null, overrideRuleHoliday)
        });

        holidayjs.calculateHolidays('ca', 2016, function(err, holidays) {
          expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
          expect(holidays[0].date).toBe('2016-05-23')
          done()
        })
      })
    })
  })
})