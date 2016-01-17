describe('HolidayJS', function() {
  var holidayjs = require('../../lib/holidayjs')


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

  it('should generate holidays off the override rule', function() {

  })
})