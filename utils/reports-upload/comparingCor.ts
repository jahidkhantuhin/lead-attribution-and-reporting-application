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

export const comparingCorColumns = () => {
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
    //Total Trends
    // {
    //   upload: {
    //     value: (value: any) => value,
    //     styles: {
    //       width: '12px',
    //       textAlign: 'left',
    //       align: 'left',
    //     },
    //   },
    //   text: `Ref. Total Trends`,
    //   align: `start`,
    //   value: `ref_month_total_trends`,
    //   width: '130px',
    // },
    // {
    //   upload: {
    //     value: (value: any) => value,
    //     styles: {
    //       width: '12px',
    //       textAlign: 'left',
    //       align: 'left',
    //     },
    //   },
    //   text: `Comp. Total Trends`,
    //   align: `start`,
    //   value: `comp_month_total_trends`,
    //   width: '130px',
    // },
    // {
    //   upload: {
    //     value: (value: any) => value,
    //     styles: {
    //       width: '12px',
    //       textAlign: 'left',
    //       align: 'left',
    //     },
    //   },
    //   text: `Change`,
    //   align: `start`,
    //   value: `diff_of_total_trends`,
    //   width: '130px',
    // },
    // {
    //   upload: {
    //     value: (value: any) => value,
    //     styles: {
    //       width: '12px',
    //       textAlign: 'left',
    //       align: 'left',
    //     },
    //   },
    //   text: `Change (%)`,
    //   align: `start`,
    //   value: `percentage_diff_of_total_trends`,
    //   width: '130px',
    // },
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
    //Aggregate Spend
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. Aggregate Spend`,
      align: `start`,
      value: `ref_month_total_aggregate_cost`,
      width: '150px',
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
      text: `Comp. Aggregate Spend`,
      align: `start`,
      value: `comp_month_total_aggregate_cost`,
      width: '150px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_total_aggregate_cost`,
      width: '150px',
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_aggregate_cost`,
      width: '150px',
    },
    //Total Budget
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. Total Budget`,
      align: `start`,
      value: `ref_month_total_budget`,
      width: '150px',
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
      text: `Comp. Total Budget`,
      align: `start`,
      value: `comp_month_total_budget`,
      width: '150px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_total_budget`,
      width: '150px',
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_budget`,
      width: '150px',
    },
    
    //% of Budget Spent
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. % of Budget Spent`,
      align: `start`,
      value: `ref_month_percentageOf_budget_spent`,
      width: '150px',
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
      text: `Comp. % of Budget Spent`,
      align: `start`,
      value: `comp_month_percentageOf_budget_spent`,
      width: '150px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_percentageOf_budget_spent`,
      width: '150px',
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
    //Adwords Leads
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Ref. Adwords Leads`,
      align: `start`,
      value: `ref_month_total_adwords_leads`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Comp. Adwords Leads`,
      align: `start`,
      value: `comp_month_total_adwords_leads`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Change`,
      align: `start`,
      value: `diff_of_total_adwords_leads`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_adwords_leads`,
      width: '150px',
    },
    //Adwords Spend
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. Adwords Spend`,
      align: `start`,
      value: `ref_month_total_adwords_cost`,
      width: '150px',
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
      text: `Comp. Adwords Spend`,
      align: `start`,
      value: `comp_month_total_adwords_cost`,
      width: '150px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_total_adwords_cost`,
      width: '150px',
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_adwords_cost`,
      width: '150px',
    },
    //Adwords Budget
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. Adwords Budget`,
      align: `start`,
      value: `ref_month_adwords_budget`,
      width: '150px',
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
      text: `Comp. Adwords Budget`,
      align: `start`,
      value: `comp_month_adwords_budget`,
      width: '150px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_adwords_budget`,
      width: '150px',
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_adwords_budget`,
      width: '150px',
    },
    //Adwords # of days live in selected time period
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. days live- adwords`,
      align: `start`,
      value: `ref_month_adwords_days_live`,
      width: '150px',
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
      text: `Comp. days live- adwords`,
      align: `start`,
      value: `comp_month_adwords_days_live`,
      width: '150px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_adwords_days_live`,
      width: '150px',
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_adwords_days_live`,
      width: '150px',
    },
    //Adwords CPL
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Ref. Adwords CPL`,
      align: `start`,
      value: `ref_month_adword_cpl`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Comp. Adwords CPL`,
      align: `start`,
      value: `comp_month_adword_cpl`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Change`,
      align: `start`,
      value: `diff_of_adword_cpl`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_adword_cpl`,
      width: '150px',
    },
    //Facebook Leads
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Ref. Facebook Leads`,
      align: `start`,
      value: `ref_month_total_facebook_leads`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Comp. Facebook Leads`,
      align: `start`,
      value: `comp_month_total_facebook_leads`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Change`,
      align: `start`,
      value: `diff_of_total_facebook_leads`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_facebook_leads`,
      width: '150px',
    },
    //Facebook Spend
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. Facebook Spend`,
      align: `start`,
      value: `ref_month_total_facebook_cost`,
      width: '150px',
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
      text: `Comp. Facebook Spend`,
      align: `start`,
      value: `comp_month_total_facebook_cost`,
      width: '150px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_total_facebook_cost`,
      width: '150px',
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_total_facebook_cost`,
      width: '150px',
    },
    //Facebook Budget
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. Facebook Budget`,
      align: `start`,
      value: `ref_month_facebook_budget`,
      width: '150px',
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
      text: `Comp. Facebook Budget`,
      align: `start`,
      value: `comp_month_facebook_budget`,
      width: '150px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_facebook_budget`,
      width: '150px',
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_facebook_budget`,
      width: '150px',
    },
    //Facebook # of days live in selected time period
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
          textAlign: 'left',
          align: 'left',
        },
      },
      text: `Ref. days live- facebook`,
      align: `start`,
      value: `ref_month_facebook_days_live`,
      width: '150px',
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
      text: `Comp. days live- facebook`,
      align: `start`,
      value: `comp_month_facebook_days_live`,
      width: '150px',
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
      text: `Change`,
      align: `start`,
      value: `diff_of_facebook_days_live`,
      width: '150px',
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
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_facebook_days_live`,
      width: '150px',
    },
    //Facebook CPL
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Ref. Facebook CPL`,
      align: `start`,
      value: `ref_month_facebook_cpl`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Comp. Facebook CPL`,
      align: `start`,
      value: `comp_month_facebook_cpl`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Change`,
      align: `start`,
      value: `diff_of_facebook_cpl`,
      width: '150px',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: `Change (%)`,
      align: `start`,
      value: `percentage_diff_of_facebook_cpl`,
      width: '150px',
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
    //Total voice mail booking
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

const generateComparingCorColumnsReport = (computedReport: any, params: any) => {
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
        headings: generateHeadersFromColumns(comparingCorColumns()),
        content: generateDataFromColumnsAndData({
          columns: comparingCorColumns(),
          data: computedReport.value || [],
        }),
      },
    ],
  }
}

export default generateComparingCorColumnsReport
