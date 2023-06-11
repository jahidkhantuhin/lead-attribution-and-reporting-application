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

export const clientOverviewColumns = () => {
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
      upload: { value: (value: any) => value, styles: {} },
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
      width: '50px',
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
      text: `Total Trends`,
      align: `start`,
      value: `total_trends`,
      width: '50px',
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
      width: '20px',
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
      width: '20px',
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
      width: '20px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Aggregate Spend`,
      align: `start`,
      value: `total_aggregate_cost`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Total Budget`,
      align: `start`,
      value: `total_budget`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Predicted Spend`,
      align: `start`,
      value: `predicted_spend`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `% of Budget Spent`,
      align: `start`,
      value: `percentageOf_budget_spent`,
      width: '50px',
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
      width: '20px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Adwords Leads`,
      align: `start`,
      value: `total_adwords_leads`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Adwords Spend`,
      align: `start`,
      value: `total_adwords_cost`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Adwords Budget`,
      align: `start`,
      value: `location.adwords_budget`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Days live- adwords`,
      align: `start`,
      value: `adwords_days_live`,
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Adwords CPL`,
      align: `start`,
      value: `adword_cpl`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Facebook Leads`,
      align: `start`,
      value: `total_facebook_leads`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Facebook Spend`,
      align: `start`,
      value: `total_facebook_cost`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Facebook Budget`,
      align: `start`,
      value: `location.facebook_budget`,
      width: '50px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Days live- facebook`,
      align: `start`,
      value: `fb_days_live`,
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Facebook CPL`,
      align: `start`,
      value: `facebook_cpl`,
      width: '50px',
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
      width: '20px',
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
      width: '20px',
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
      width: '20px',
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
      width: '20px',
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
      width: '20px',
    },    
  ]
}

const generateClientOverviewReport = (computedReport: any, params: any) => {
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
        title: 'Client Overview',
        headings: generateHeadersFromColumns(clientOverviewColumns()),
        content: generateDataFromColumnsAndData({
          columns: clientOverviewColumns(),
          data: computedReport.value || [],
        }),
      },
    ],
  }
}

export default generateClientOverviewReport
