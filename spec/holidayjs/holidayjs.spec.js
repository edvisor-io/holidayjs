describe('HolidayJS', function() {
  
  describe('Accessing data files', function() {
    var holidayjs

    beforeEach(function(){
      holidayjs = require('../../lib/holidayjs')
    })

    it('should open the appropriate country data file', function(done) {
      holidayjs._openCountryData('test', function(err, data) {
        expect(data).not.toBe(null);
        expect(data).not.toBe(undefined);
        expect(data instanceof Array).toBe(true);

        done()
      })
    })

    it('should error if the country data file is not found', function(done) {
      holidayjs._openCountryData('fake', function(err, data) {
        expect(data).toBe(undefined);
        expect(err).not.toBe(null);

        done()
      })
    })

    it('should force country code to lowercase', function(done) {
      holidayjs._openCountryData('TEST', function(err, data) {
        expect(data).not.toBe(null);
        expect(data).not.toBe(undefined);
        expect(data instanceof Array).toBe(true);

        done()
      })
    })
  })

  it('should generate holidays off the override rule', function(done) {
    var holidayjs = require('../../lib/holidayjs')
    var overrideRuleHoliday = [{
      name: 'Override holiday',
      override: 'January 5'
    }]

    spyOn(holidayjs, '_openCountryData').and.callFake(function(country, cb) {
      cb(null, overrideRuleHoliday)
    });

    holidayjs.calculateHolidays('ca', 2015, function(err, holidays) {

      expect(holidays[0].name).toBe(overrideRuleHoliday[0].name)
      expect(holidays[0].date).toBe('2015-01-05')
      done()
    })
  })
})