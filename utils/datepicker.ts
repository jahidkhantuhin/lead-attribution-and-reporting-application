import moment from 'moment'

export const datePickerHelperButtons = {
  last14Days: {
    label: 'Last 14 Days',
    handler() {
      return [
        moment().subtract(14, 'days').startOf('day').format('YYYY-MM-DD'),
        moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD'),
      ]
    },
  },
  lastWeek: {
    label: 'Last week',
    handler() {
      return [
        moment().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD'),
        moment().subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD'),
      ]
    },
  },
  thisWeek: {
    label: 'This week',
    handler() {
      return [
        moment().startOf('isoWeek').format('YYYY-MM-DD'),
        // moment().endOf('isoWeek').format('YYYY-MM-DD'),
        moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD'),
      ]
    },
  },
  last2Weeks: {
    label: 'Last 2 weeks',
    handler() {
      return [
        moment().subtract('3', 'week').startOf('isoWeek').format('YYYY-MM-DD'),
        moment().subtract('1', 'week').endOf('isoWeek').format('YYYY-MM-DD'),
      ]
    },
  },
  lastMonth: {
    label: 'Last month',
    handler() {
      return [
        moment().subtract('1', 'month').startOf('month').format('YYYY-MM-DD'),
        moment().subtract('1', 'month').endOf('month').format('YYYY-MM-DD'),
      ]
    },
  },
  thisMonth: {
    label: 'This month',
    handler() {
      return [
        moment().startOf('month').format('YYYY-MM-DD'),
        // moment(new Date()).format('YYYY-MM-DD'),
        moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD'),
      ]
    },
  },
  last3Months: {
    label: 'Last 3 month',
    handler() {
      return [
        moment().subtract('3', 'month').startOf('month').format('YYYY-MM-DD'),
        moment().subtract('1', 'month').endOf('month').format('YYYY-MM-DD'),
      ]
    },
  },
  last6Months: {
    label: 'Last 6 months',
    handler() {
      return [
        moment().subtract('6', 'month').startOf('month').format('YYYY-MM-DD'),
        moment().subtract('1', 'month').endOf('month').format('YYYY-MM-DD'),
      ]
    },
  },
  thisYear: {
    label: 'This year',
    handler() {
      return [
        moment().startOf('year').format('YYYY-MM-DD'),
        moment(new Date()).format('YYYY-MM-DD'),
      ]
    },
  },
  lastYear: {
    label: 'Last year',
    handler() {
      return [
        moment().subtract('1', 'year').startOf('year').format('YYYY-MM-DD'),
        moment().subtract('1', 'year').endOf('year').format('YYYY-MM-DD'),
      ]
    },
  },
  last2Years: {
    label: 'Last 2 Years',
    handler() {
      return [
        moment().subtract('2', 'year').startOf('year').format('YYYY-MM-DD'),
        moment().endOf('day').format('YYYY-MM-DD'),
      ]
    },
  },
  last5Years: {
    label: 'Last 5 years',
    handler() {
      return [
        moment().subtract('5', 'year').startOf('year').format('YYYY-MM-DD'),
        moment().endOf('day').format('YYYY-MM-DD'),
      ]
    },
  },
  jan2022: {
    label: 'Jan 22',
    handler() {
      return [
        '2022-01-01',
        '2022-01-31',
      ]
    },
  },
  all: {
    label: 'All',
    handler() {
      return []
    },
  },
}
