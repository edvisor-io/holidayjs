/*
  rule: {
    override: '',
    generator: {
      special: '%EASTER',
      day: {
        day: '',
        placement: 1 //possible values are -1, -2, -3, -4, 1, 2, 3, 4
      },
      month: 'september',
      modifier: '+3 days'
    }
  }
*/

module.exports = [
  {
    name: 'New Year\'s Day',
    rule: {
      override: 'January 1'
    }
  }, { 
    name: 'Family Day',     
    rule: {
      generator: {
        day: {
          day: 'Monday',
          placement: 3
        },
        month: 'February'
      }
    }
  }, { 
    name: 'Good Friday',     
    rule: {
      generator: {
        special: '%EASTER',
        modifier: '-2 days'
      }
    }
  }, { 
    name: 'Victoria Day',    
    rule: {
      generator: {
        day: {
          day: 'Monday',
          placement: 3
        },
        month: 'May'
      }
    }
  }, {
    name: 'Canada Day',
    rule: {
      override: 'July 1' 
    }
  }, { 
    name: 'Labor Day',
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
    name: 'Thanksgiving',
    rule: {
      generator: {
        day: {
          day: 'Monday',
          placement: 2
        },
        month: 'October'
      }
    }
  }, {
    name: 'Remembrance Day',
    rule: {
      generator: {
        day: {
          day: 'Monday',
          placement: 2
        },
        month: 'October'
      }
    }
  }, {
    name: 'Christmas',
    rule: {
      override: 'December 25'
    }
  }
]