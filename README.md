# holidayjs

This is a holiday generator with heavy inspiration from holidayapi.com (https://github.com/joshtronic/holidayapi.com)

## how to use

```
var holidayjs = require('holidayjs')('<path to your data files>')

holidayjs.calculateHolidays('ca', 2015, function(err, holidays) {
  //do stuff with the holidays
})
```

## holiday outputted format
```
[{
  name: 'Halloween',
  date: '2015-10-31'
},{
  name: 'Christmas',
  date: '2015-12-25'
}, ...]
```

## data file format
```
[{
  name: '<some name>',
  rule: {
    override: '', //use if you have a specific date in mind, ie. 'January 1'
    generator: {
      special: '', //use to base date relatively off a special date. accepted values are %EASTER
      day: {
        day: '', //use to specify day of the week, ie. 'Monday'
        placement: 1 //use to relatively choose the day of the week. possible values are -1, -2, -3, -4, 1, 2, 3, 4
      },
      month: 'september', //use to specify month, ie. 'September'
      modifier: '+3 days' //use to offset the date by some amount
    }
  }
}, {}, ...]
```


## data file sample
```
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
```
