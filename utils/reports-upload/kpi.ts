import moment from 'moment'
import { callColors } from '~/shared/callColors'

export const KPIColumnSections = {
  dates: {
    dailyColumn: {
      upload: {
        value: (value: any) => {
          return moment(value).format('ddd, MMM DD, YYYY')
        },
        styles: {
          width: '14px',
        },
      },
      text: 'Date',
      value: 'date',
      width: '140px',
    },
    monthColumn: {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '12px',
        },
      },
      text: 'Month',
      value: 'month',
      width: '100px',
    },
  },
  fb: [
    {
      upload: {
        value: (value: any) => {
          return `$${new Number(value).toFixed(2)}`
        },
        styles: {
          width: '8px',
          bgColor: '#E3F2FD',
          color: '#000',
        },
      },
      text: 'FB Cost',
      value: 'fb_cost',
      width: '95px',
      class: 'blue lighten-5',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '12px',
          bgColor: '#E3F2FD',
          color: '#000',
        },
      },
      text: 'FB Conversions',
      value: 'fb_conversions',
      width: '90px',
      class: 'blue lighten-5',
    },
    {
      upload: {
        value: (value: any) => {
          return `$${new Number(value).toFixed(2)}`
        },
        styles: {
          width: '8px',
          bgColor: '#E3F2FD',
          color: '#000',
        },
      },
      text: 'FB CPL',
      value: 'fb_cpl',
      width: '50px',
      class: 'blue lighten-5',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '8px',
          bgColor: '#E3F2FD',
          color: '#000',
        },
      },
      text: 'FB Clicks',
      value: 'fb_clicks',
      width: '50px',
      class: 'blue lighten-5',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '13px',
          bgColor: '#E3F2FD',
          color: '#000',
        },
      },
      text: 'FB Impressions',
      value: 'fb_impressions',
      width: '90px',
      class: 'blue lighten-5',
    },
    // {
    //   upload: {
    //     value: (value: any) => {
    //       return `$${new Number(value).toFixed(2)}`
    //     },
    //     styles: {
    //       width: '13px',
    //       bgColor: '#E3F2FD',
    //       color: '#000',
    //     },
    //   },
    //   text: 'FB Avg. Cost',
    //   value: 'fb_avg_cost',
    //   width: '117px',
    //   class: 'blue lighten-5',
    // },
    {
      upload: {
        value: (value: any) => {
          return `$${new Number(value).toFixed(2)}`
        },
        styles: {
          width: '13px',
          bgColor: '#E3F2FD',
          color: '#000',
        },
      },
      text: 'FB Avg CPC',
      value: 'fb_avg_cpc',
      width: '117px',
      class: 'blue lighten-5',
    },
  ],
  adwords: [
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: { width: '8px', bgColor: '#FFEBEE', color: '#000' },
      },
      text: 'AW Clicks',
      value: 'adwords_clicks',
      width: '50px',
      class: 'red lighten-5',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: { width: '12px', bgColor: '#FFEBEE', color: '#000' },
      },
      text: 'AW Impressions',
      value: 'adwords_impressions',
      width: '110px',
      class: 'red lighten-5',
    },
    {
      upload: {
        value: (value: any) => {
          return `$${new Number(value).toFixed(2)}`
        },
        styles: { width: '8px', bgColor: '#FFEBEE', color: '#000' },
      },
      text: 'AW Cost',
      value: 'adwords_cost',
      class: 'red lighten-5',
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => {
          return `$${new Number(value).toFixed(2)}`
        },
        styles: { width: '8px', bgColor: '#FFEBEE', color: '#000' },
      },
      text: 'Total AW CPC',
      value: 'total_adwords_cpc',
      class: 'red lighten-5',
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: { width: '15px', bgColor: '#FFEBEE', color: '#000' },
      },
      text: 'AW Conversions',
      value: 'adwords_conversions',
      class: 'red lighten-5',
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => {
          return `$${new Number(value).toFixed(2)}`
        },
        styles: { width: '8px', bgColor: '#FFEBEE', color: '#000' },
      },
      text: 'AW CPL',
      value: 'adwords_cpl',
      class: 'red lighten-5',
      width: '50px',
    },
  ],
  leads: [
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '6px',
        },
      },
      text: 'Calls',
      value: 'total_calls',
      width: '38px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '6px',
        },
      },
      text: 'Forms',
      value: 'total_forms',
      width: '38px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '6px',
        },
      },
      text: 'Chats',
      value: 'total_chats',
      width: '38px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '9px',
        },
      },
      text: 'Total Leads',
      value: 'total_leads',
      width: '50px',
    },

    {
      upload: {
        value: (value: any) => {
          return `$${new Number(value).toFixed(2)}`
        },
        styles: {
          width: '9px',
        },
      },
      text: 'Total Cost',
      value: 'total_cost',
      width: '80px',
    },
    {
      upload: {
        value: (value: any) => {
          return `$${new Number(value).toFixed(2)}`
        },
        styles: {
          width: '8px',
        },
      },
      text: 'Total CPL',
      value: 'total_cpl',
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '14px',
        },
      },
      text: 'Total Conversions',
      value: 'total_conversions',
      width: '50px',
    },
  ],
  score: [
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          width: '14px',
        },
      },
      text: 'Conversion %',
      value: 'conversion_percentage',
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          color: callColors.booked_color,
          width: '4px',
        },
      },
      text: 'G',
      value: 'total_booked',
      width: '35px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          color: callColors.not_booked_color,
          width: '4px',
        },
      },
      text: 'R',
      value: 'total_not_booked',
      width: '35px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          color: callColors.voice_mail_booking,
          width: '4px',
        },
      },
      text: 'O',
      value: 'total_voice_mail_booking',
      width: '35px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          color: callColors.missed_color,
          width: '4px',
        },
      },
      text: 'Y',
      value: 'total_missed',
      width: '35px',
    },
    {
      upload: {
        value: (value: any) => {
          return value
        },
        styles: {
          color: callColors.irrelevant_color,
          width: '4px',
        },
      },
      text: 'B',
      value: 'total_irrelevant',
      width: '35px',
    },
  ],
}

interface KPIReportUploadProps {
  user: {
    fullname: string
  }
  client: {
    name: string
  }
  location: ''
  filters: {
    dates: Array<string>
    client_id: null | string | number
    location_ids: Array<string> | Array<number>
    type: string
  }
  summary: any
}

export const generateKPIReportHeaders = (type: 'month' | 'daily' = 'daily') => {
  return {
    rowStyle: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#f6f6f6',
      bgColor: '#727272',
      width: '30px',
      textAlign: 'left',
    },
    data: [
      type === 'daily'
        ? KPIColumnSections.dates.dailyColumn
        : KPIColumnSections.dates.monthColumn,
      ...KPIColumnSections.leads,
      ...KPIColumnSections.adwords,
      ...KPIColumnSections.fb,
      ...KPIColumnSections.score,
    ].map((column) => {
      return {
        value: column.text,
        styles: column.upload.styles || {},
      }
    }),
  }
}

export const transformMonthlyReportIntoObject = (summary: any) => {
  let val: { [key: string]: any } = {}
  if (summary) {
    Object.keys(summary).forEach((element: string) => {
      val[element] = Object.keys(summary[element]).map((c) => {
        return {
          colors: callColors,
          ...summary[element][c],
        }
      })
    })
  }
  return val
}

export const generateKPIMonthlyReport = (props: KPIReportUploadProps) => {
  const summary = transformMonthlyReportIntoObject(props.summary)
  return {
    type: 'payment-report',
    name: `KPI Monthly Report, ${props.client.name}, ${props.location}, ${moment(
      props.filters.dates[0]
    ).format('ddd MMM DD YYYY')} to ${moment(props.filters.dates[1]).format(
      'ddd MMM DD YYYY'
    )}, Generated by ${props.user.fullname}`,
    sheets: [
      {
        title: 'KPI Report',
        headings: {
          rowStyle: {},
          data: [],
        },
        content: Object.keys({ ...summary }).flatMap((year) => {
          return [
            {
              rowStyle: {},
              data: [
                {
                  value: year,
                  styles: {
                    fontSize: '30px',
                    colSpan: 4,
                  },
                },
              ],
            },
            {
              ...generateKPIReportHeaders('month'),
            },
            ...generateKPIReportData(summary[year], 'month'),
          ]
        }),
      },
    ],
  }
}

const generateKPIReportData = (
  summary: Array<any>,
  type: 'daily' | 'month' = 'daily'
) => {
  return summary.map((item: any) => {
    return {
      rowStyle: {},
      data: [
        type === 'daily'
          ? KPIColumnSections.dates.dailyColumn
          : KPIColumnSections.dates.monthColumn,
        ...KPIColumnSections.leads,
        ...KPIColumnSections.adwords,
        ...KPIColumnSections.fb,
        ...KPIColumnSections.score,
      ].map((column) => {
        return {
          value: !!column.upload.value
            ? column.upload.value(item[column.value])
            : item[column.value] || '',
          styles: !!column.upload.styles ? column.upload.styles : {},
        }
      }),
    }
  })
}

export const generateKPIDailyReport = (props: KPIReportUploadProps) => {
  return {
    type: 'payment-report',
    name: `KPI Daily Report, ${props.client.name}, ${props.location}, ${moment(
      props.filters.dates[0]
    ).format('ddd MMM DD YYYY')} to ${moment(props.filters.dates[1]).format(
      'ddd MMM DD YYYY'
    )}, Generated by ${props.user.fullname}`,
    sheets: [
      {
        title: 'KPI Report',
        headings: generateKPIReportHeaders(),
        content: generateKPIReportData(props.summary, 'daily'),
      },
    ],
  }
}
