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

  value: `account_manager`,

  width: '150px',
}

export const comparingSeoCorColumns = () => {
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
      value: `client`, // @TODO: change to fullname

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
    //Total Leads
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '12px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. Total Leads`,
      align: `start`,
      value: `ref_month_total_leads`,
      width: '130px',
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
      text: `Comp. Total Leads`,
      align: `start`,
      value: `comp_month_total_leads`,
      width: '130px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_total_leads`,
      width: '130px',
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_leads`,
      width: '130px',
    },
    
    //All Calls
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: '',
          width: '8px',
        },
      },
      text: `Ref. Calls`,
      align: `start`,
      value: `ref_month_total_calls`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: '',
          width: '8px',
        },
      },
      text: `Comp. Calls`,
      align: `start`,
      value: `comp_month_total_calls`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: '',
          width: '8px',
        },
      },
      text: `Change`,
      align: `start`,
      value: `diff_of_total_calls`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: '',
          width: '8px',
        },
      },
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_calls`,
      width: '100px',
    },
    //All Forms
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Ref. Forms`,
      align: `start`,
      value: `ref_month_total_forms`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Comp. Forms`,
      align: `start`,
      value: `comp_month_total_forms`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Change`,
      align: `start`,
      value: `diff_of_total_forms`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_forms`,
      width: '100px',
    },
    //All Chats
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Ref. Chats`,
      align: `start`,
      value: `ref_month_total_chats`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Comp. Chats`,
      align: `start`,
      value: `comp_month_total_chats`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Change`,
      align: `start`,
      value: `diff_of_total_chats`,
      width: '100px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '8px',
        },
      },
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_chats`,
      width: '100px',
    },
   
    //Total CPL
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '12px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. CPL`,
      align: `start`,
      value: `ref_month_total_cpl`,
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
      text: `Comp. CPL`,
      align: `start`,
      value: `comp_month_total_cpl`,
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
      text: `Change`,
      align: `start`,
      value: `diff_of_total_cpl`,
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_cpl`,
      width: '80px',
    },

    //Monthly Fee
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '12px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. Monthly Fee`,
      align: `start`,
      value: `ref_month_monthly_fee`,
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
      text: `Comp. Monthly Fee`,
      align: `start`,
      value: `comp_month_monthly_fee`,
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
      text: `Change`,
      align: `start`,
      value: `diff_of_monthly_fee`,
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_monthly_fee`,
      width: '80px',
    },
   
    //Total booked calls
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.booked_color,
          width: '5px',
        },
      },
      text: 'Ref. G',
      value: 'ref_month_total_booked',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.booked_color,
          width: '5px',
        },
      },
      text: 'Comp. G',
      value: 'comp_month_total_booked',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.booked_color,
          width: '5px',
        },
      },
      text: 'Change',
      value: 'diff_of_total_booked',
      width: '70px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.booked_color,
          width: '5px',
        },
      },
      text: 'Change (%)',
      value: 'percentage_diff_of_total_booked',
      width: '70px',
    },
    //Total not booked calls
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.not_booked_color,
          width: '5px',
        },
      },
      text: 'Ref. R',
      value: 'ref_month_total_not_booked',
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
      text: 'Comp. R',
      value: 'comp_month_total_not_booked',
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
      text: 'Change',
      value: 'diff_of_total_not_booked',
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
      text: 'Change (%)',
      value: 'percentage_diff_of_total_not_booked',
      width: '70px',
    },
    //Total voic mail booking
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.voice_mail_booking,
          width: '5px',
        },
      },
      text: 'Ref. O',
      value: 'ref_month_total_voice_mail_booking',
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
      text: 'Comp. O',
      value: 'comp_month_total_voice_mail_booking',
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
      text: 'Change',
      value: 'diff_of_total_voice_mail_booking',
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
      text: 'Change (%)',
      value: 'percentage_diff_of_total_voice_mail_booking',
      width: '70px',
    },
    //Total missed calls
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.missed_color,
          width: '5px',
        },
      },
      text: 'Ref. Y',
      value: 'ref_month_total_missed',
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
      text: 'Comp. Y',
      value: 'comp_month_total_missed',
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
      text: 'Change',
      value: 'diff_of_total_missed',
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
      text: 'Change (%)',
      value: 'percentage_diff_of_total_missed',
      width: '70px',
    },
    //Total irrelevant calls
    {
      upload: {
        value: (value: any) => value,
        styles: {
          color: callColors.irrelevant_color,
          width: '5px',
        },
      },
      text: 'Ref. B',
      value: 'ref_month_total_irrelevant',
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
      text: 'Comp. B',
      value: 'comp_month_total_irrelevant',
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
      text: 'Change',
      value: 'diff_of_total_irrelevant',
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
      text: 'Change (%)',
      value: 'percentage_diff_of_total_irrelevant',
      width: '70px',
    },
  ]
}

const generateComparingSeoCorColumnsReport = (computedReport: any, params: any) => {
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
        headings: generateHeadersFromColumns(comparingSeoCorColumns()),
        content: generateDataFromColumnsAndData({
          columns: comparingSeoCorColumns(),
          data: computedReport.value || [],
        }),
      },
    ],
  }
}

export default generateComparingSeoCorColumnsReport
