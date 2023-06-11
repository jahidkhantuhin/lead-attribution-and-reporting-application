import moment from 'moment'
import { callColors } from '~/shared/callColors'
import {
  generateDataFromColumnsAndData,
  generateHeadersFromColumns,
} from './helpers'

export const accountManagerColumn = {
  upload: {
    value: (value: any) => value,
    styles: {
      width: '20px',
    },
  },
  text: `Account manager`,
  align: `start`,
  sortable: true,
  value: `location.account_manager`,

  width: '100px',
}


// SEO COR Report

export const seoCorColumns = () => {
  return [
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: `Client`,
      align: `start`,
      sortable: true,
      value: `location.name`, // @TODO: change to fullname

      width: '200px',
    },
    
    accountManagerColumn,
    {
      upload: { value: (value: any) => value, styles: {
        
        }, 
      },
      text: `Links`,
      align: `start`,
      value: `actions`,
      displayInExcel: false,
      sortable: false,
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '12px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Total Leads`,
      align: `start`,
      value: `total_leads`,
      width: '130px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: '',
          width: '8px',
        },
      },
      text: `Calls`,
      align: `start`,
      value: `total_calls`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Forms`,
      align: `start`,
      value: `total_forms`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Chats`,
      align: `start`,
      value: `total_chats`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '12px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `CPL`,
      align: `start`,
      value: `total_cpl`,
      width: '80px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '12px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Monthly Fee`,
      align: `start`,
      value: `location.monthly_fee`,
      width: '80px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.booked_color,
          width: '5px',
        },
      },
      text: 'G',
      value: 'total_booked',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.not_booked_color,
          width: '5px',
        },
      },
      text: 'R',
      value: 'total_not_booked',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.voice_mail_booking,
          width: '5px',
        },
      },
      text: 'O',
      value: 'total_voice_mail_booking',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.missed_color,
          width: '5px',
        },
      },
      text: 'Y',
      value: 'total_missed',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.irrelevant_color,
          width: '5px',
        },
      },
      text: 'B',
      value: 'total_irrelevant',
      width: '70px',
    },
    // Below fields are unnecessary
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '12px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: ``,
      align: `start`,
      value: `location.`,
      width: '80px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.booked_color,
          width: '5px',
        },
      },
      text: '',
      value: '',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.not_booked_color,
          width: '5px',
        },
      },
      text: '',
      value: '',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.voice_mail_booking,
          width: '5px',
        },
      },
      text: '',
      value: '',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.missed_color,
          width: '5px',
        },
      },
      text: '',
      value: '',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.irrelevant_color,
          width: '5px',
        },
      },
      text: '',
      value: '',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.irrelevant_color,
          width: '5px',
        },
      },
      text: '',
      value: '',
      width: '70px',
    },
  ]
}

const generateSeoCorOverviewReport = (computedReport: any, params: any) => {
  const { user, filters } = params
  return {
    type: 'client-overview-report',
    // name: 'client-overview-report',
    name: `Client Overview Report, ${moment(filters.value.dates[0]).format(
      'YYYY-DD-MM'
    )}-to-${moment(filters.value.dates[1]).format(
      'YYYY-DD-MM'
    )}, Generated by ${user.fullname}`,
    sheets: [
      {
        title: 'SEO COR report',
        headings: generateHeadersFromColumns(seoCorColumns()),
        content: generateDataFromColumnsAndData({
          columns: seoCorColumns(),
          data: computedReport.value || [],
        }),
      },
    ],
  }
}

export default generateSeoCorOverviewReport
