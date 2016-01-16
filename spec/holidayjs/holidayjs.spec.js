describe('HolidayJS', function() {
  var holidayjs = require('../../lib/holidayjs')

  it('should open the appropriate country data file', function() {
    holidayjs._openCountryData('ca', function(err, data) {
      console.log(data)
    })
  })

  it('should error if the country data file is not found', function() {
    
  })

  it('should generate holidays off the override rule', function() {

  })
})