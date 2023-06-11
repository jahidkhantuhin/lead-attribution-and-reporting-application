import { upperFirst } from 'lodash'
import moment from 'moment'
import { usPhone } from '~/plugins/usPhone'
import { callAudio } from '~/plugins/callAudio'


export const ldrAllColumns = () => {
  return [
    {
      width: '80px',
      value: 'timestamp',
      align: 'start',
      upload: {
        value: (value: any, item: any) =>
          moment(value).format('dddd, MMMM DD, YYYY @ hh:mm:ss A z'),
        styles: {},
      },
      text: 'Local Date',
    },
    {
      width: '80px',
      value: 'type',
      align: 'start',
      upload: {
        value: (value: any) => upperFirst(value),
        styles: {
          width: '5px',
        },
      },
      text: 'Type',
    },
    {
      width: '200px',
      value: 'name',
      align: 'start',
      upload: {
        value: (value: any, item: any) => {
          return value
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Lead name',
    },
    {
      width: '200px',
      value: 'email',
      align: 'start',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead Email',
    },
    {
      width: '220px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
    },
    {
      width: '120px',
      value: 'procedure',
      align: 'start',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Procedure',
    },
    {
      width: '100px',
      value: 'phone',
      align: 'start',
      upload: {
        value: (value: any) => usPhone(value),
        styles: {
          width: '20px',
        },
      },
      text: 'Lead Phone',
    },
  ]
}

export const ldrChatsColumns = () => {
  return [
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'chat_date',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return value || ''
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'lead.name',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return value || ''
        },
        styles: {
          width: '25px',
        },
      },
      text: 'Lead Email',
      align: 'start',
      value: 'lead.email',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => {
          return upperFirst(value)
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Lead Source',
      align: 'start',
      value: 'lead.lead_source',
    },
    {
      width: '200px',
      value: 'lead.phone',
      align: 'start',
      upload: {
        value: (value: any) => {
          return usPhone(value)
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Lead Phone',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Keywords',
      align: 'start',
      value: 'keywords',
    },
    {
      upload: {
        value: (value: any, item: any) => value,
        styles: {
          width: '50px',
        },
      },
      text: 'Referrer',
      sortable: false,
      align: 'start',
      value: 'referrer',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Website',
      align: 'start',
      value: 'website',
    },
    {
      upload: { value: (value: any) => value, styles: {} },
      text: `Chat`,
      align: `middle`,
      sortable: false,
      value: `chat`,
    },
  ]
}
export const ldr_PPC_ChatsColumns = () => {
  return [
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'chat_date',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return value || ''
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'lead.name',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return value || ''
        },
        styles: {
          width: '25px',
        },
      },
      text: 'Lead Email',
      align: 'start',
      value: 'lead.email',
    },
    {
      width: '120px',
      upload: {
        value: (value: any, item: any) => {
          return upperFirst(value)
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Lead Source',
      align: 'start',
      value: 'lead.lead_source',
    },
    {
      width: '170px',
      value: 'lead.phone',
      align: 'start',
      upload: {
        value: (value: any) => {
          return usPhone(value)
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Lead Phone',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Keywords',
      align: 'start',
      value: 'keywords',
    },
    {
      upload: {
        value: (value: any, item: any) => value,
        styles: {
          width: '50px',
        },
      },
      text: 'Referrer',
      sortable: false,
      align: 'start',
      value: 'referrer',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Website',
      align: 'start',
      value: 'website',
    },
    {
      upload: { value: (value: any) => value, styles: {} },
      text: `Chat`,
      align: `middle`,
      sortable: false,
      value: `chat`,
    },
  ]
}

export const ldr_FB_ChatsColumns = () => {
  return [
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'chat_date',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return value || ''
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'lead.name',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return value || ''
        },
        styles: {
          width: '25px',
        },
      },
      text: 'Lead Email',
      align: 'start',
      value: 'lead.email',
    },
    {
      width: '120px',
      upload: {
        value: (value: any, item: any) => {
          return upperFirst(value)
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Lead Source',
      align: 'start',
      value: 'lead.lead_source',
    },
    {
      width: '170px',
      value: 'lead.phone',
      align: 'start',
      upload: {
        value: (value: any) => {
          return usPhone(value)
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Lead Phone',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Keywords',
      align: 'start',
      value: 'keywords',
    },
    {
      upload: {
        value: (value: any, item: any) => value,
        styles: {
          width: '50px',
        },
      },
      text: 'Referrer',
      sortable: false,
      align: 'start',
      value: 'referrer',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Website',
      align: 'start',
      value: 'website',
    },
    {
      upload: { value: (value: any) => value, styles: {} },
      text: `Chat`,
      align: `middle`,
      sortable: false,
      value: `chat`,
    },
  ]
}

export const ldr_SEO_ChatsColumns = () => {
  return [
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'chat_date',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return value || ''
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'lead.name',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return value || ''
        },
        styles: {
          width: '25px',
        },
      },
      text: 'Lead Email',
      align: 'start',
      value: 'lead.email',
    },
    {
      width: '120px',
      upload: {
        value: (value: any, item: any) => {
          return upperFirst(value)
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Lead Source',
      align: 'start',
      value: 'lead.lead_source',
    },
    {
      width: '170px',
      value: 'lead.phone',
      align: 'start',
      upload: {
        value: (value: any) => {
          return usPhone(value)
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Lead Phone',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Keywords',
      align: 'start',
      value: 'keywords',
    },
    {
      upload: {
        value: (value: any, item: any) => value,
        styles: {
          width: '50px',
        },
      },
      text: 'Referrer',
      sortable: false,
      align: 'start',
      value: 'referrer',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Website',
      align: 'start',
      value: 'website',
    },
    {
      upload: { value: (value: any) => value, styles: {} },
      text: `Chat`,
      align: `middle`,
      sortable: false,
      value: `chat`,
    },
  ]
}

export const ldrCallsColumns = () => {
  return [
    {
      // width: '230px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'call_start',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '22px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'caller_name',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => upperFirst(value),
        styles: {
          width: '10px',
        },
      },
      text: 'Lead source',
      align: 'start',
      value: 'other_details.lead_source',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '23px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
    },
    // usPhone(call.other_details.marketing_number)

    {
      width: '200px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item.caller_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Caller Number',
      align: 'start',
      value: 'caller_number',
    },
    {
      width: '220px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item?.other_details?.marketing_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Marketing Number',
      align: 'start',
      value: 'marketing_number',
    },
    {
      width: '220px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Caller Name',
      align: 'start',
      value: 'caller_name',
    },
    {
      width: '220px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item?.other_details?.answering_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Answering Number',
      align: 'start',
      value: 'answering_number',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return moment(item.call_start).format('dddd')
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Day',
      align: 'start',
      value: 'day',
      width: '120px',
    },
    {
      width: '200px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.person_name
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Patient Name',
      align: 'start',
      value: 'score.person_name',
    },

    {
      width: '200px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.procedure?.name || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Procedure',
      align: 'start',
      value: 'score.procedure.name',
    },
    {
      width: '150px',
      upload: {
        value: (value: any, item: any) => {
          return upperFirst(item?.score?.booked_appointment) || ''
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Disposition',
      align: 'start',
      value: 'score.booked_appointment',
    },
    {
      width: '180px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '10px',
        },
      },
      text: 'Duration',
      align: 'start',
      value: 'call_duration',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.comment || ''
        },
        styles: {
          width: '50px',
        },
      },
      text: 'Comment',
      align: 'start',
      value: 'score.comment',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => {
          return callAudio(item?.call_url)
        },
        styles: {
          width: '85px',
        },
      },
      text: 'URL',
      // displayInExcel: false,
      value: 'call_url',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => item?.other_details?.rule || '',
        styles: {},
      },
      text: 'Rule',
      displayInExcel: false,
      value: 'other_details.rule',
    },
  ]
}

export const ldr_PPC_CallsColumns = () => {
  return [
    {
      width: '80px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'call_start',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '22px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'caller_name',
    },
    {
      width: '120px',
      upload: {
        value: (value: any) => upperFirst(value),
        styles: {
          width: '10px',
        },
      },
      text: 'Lead source',
      align: 'start',
      value: 'other_details.lead_source',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '23px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
    },
    // usPhone(call.other_details.marketing_number)

    {
      width: '170px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item.caller_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Caller Number',
      align: 'start',
      value: 'caller_number',
    },
    {
      width: '170px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item?.other_details?.marketing_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Marketing Number',
      align: 'start',
      value: 'marketing_number',
    },
    {
      width: '220px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Caller Name',
      align: 'start',
      value: 'caller_name',
    },
    {
      width: '170px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item?.other_details?.answering_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Answering Number',
      align: 'start',
      value: 'answering_number',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return moment(item.call_start).format('ddd')
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Day',
      align: 'start',
      value: 'day',
      width: '120px',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.person_name
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Patient`s Name',
      align: 'start',
      value: 'score.person_name',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.who_answered
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Who Answered',
      align: 'start',
      value: 'score.who_answered',
    },

    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.procedure?.name || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Procedure',
      align: 'start',
      value: 'score.procedure.name',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.booked_appointment || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Appt Booked',
      align: 'start',
      value: 'score.booked_appointment',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.consult_offered || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Consult Offered',
      align: 'start',
      value: 'score.consult_offered',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.handler_pitch || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Handler Pitch',
      align: 'start',
      value: 'score.handler_pitch',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.identify_office || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Identify Office',
      align: 'start',
      value: 'score.identify_office',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.recipient_name || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Recipient Name',
      align: 'start',
      value: 'score.recipient_name',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.appt_date || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Appt Date',
      align: 'start',
      value: 'score.appt_date',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.appt_time || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Appt Time',
      align: 'start',
      value: 'score.appt_time',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.call_status || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Call Status',
      align: 'start',
      value: 'call_status',
    },
    {
      width: '150px',
      upload: {
        value: (value: any, item: any) => {
          return upperFirst(item?.score?.booked_appointment) || ''
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Disposition',
      align: 'start',
      value: 'score.booked_appointment',
    },
    {
      width: '180px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '10px',
        },
      },
      text: 'Duration',
      align: 'start',
      value: 'call_duration',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.comment || ''
        },
        styles: {
          width: '50px',
        },
      },
      text: 'Comment',
      align: 'start',
      value: 'score.comment',
    },
    {
      width: '200px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '13px',
        },
      },
      text: 'CS Name',
      align: 'start',
      value: 'cs_name',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => {
          return callAudio(item?.call_url)
        },
        styles: {
          width: '85px',
        },
      },
      text: 'URL',
      // displayInExcel: false,
      value: 'call_url',
    },
    // {
    //   width: '250px',
    //   upload: {
    //     value: (value: any, item: any) => item?.other_details?.rule || '',
    //     styles: {},
    //   },
    //   text: 'Rule',
    //   displayInExcel: false,
    //   value: 'other_details.rule',
    // },
  ]
}

export const ldr_FB_CallsColumns = () => {
  return [
    {
      width: '80px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'call_start',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '22px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'caller_name',
    },
    {
      width: '120px',
      upload: {
        value: (value: any) => upperFirst(value),
        styles: {
          width: '10px',
        },
      },
      text: 'Lead source',
      align: 'start',
      value: 'other_details.lead_source',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '23px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
    },
    // usPhone(call.other_details.marketing_number)

    {
      width: '170px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item.caller_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Caller Number',
      align: 'start',
      value: 'caller_number',
    },
    {
      width: '170px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item?.other_details?.marketing_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Marketing Number',
      align: 'start',
      value: 'marketing_number',
    },
    {
      width: '220px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Caller Name',
      align: 'start',
      value: 'caller_name',
    },
    {
      width: '220px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item?.other_details?.answering_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Answering Number',
      align: 'start',
      value: 'answering_number',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return moment(item.call_start).format('dddd')
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Day',
      align: 'start',
      value: 'day',
      width: '120px',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.person_name
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Patient`s Name',
      align: 'start',
      value: 'score.person_name',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.who_answered
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Who Answered',
      align: 'start',
      value: 'score.who_answered',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.procedure?.name || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Procedure',
      align: 'start',
      value: 'score.procedure.name',
    },
    {
      width: '200px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.booked_appointment || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Appt Booked',
      align: 'start',
      value: 'score.booked_appointment',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.consult_offered || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Consult Offered',
      align: 'start',
      value: 'score.consult_offered',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.handler_pitch || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Handler Pitch',
      align: 'start',
      value: 'score.handler_pitch',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.identify_office || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Identify Office',
      align: 'start',
      value: 'score.identify_office',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.recipient_name || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Recipient Name',
      align: 'start',
      value: 'score.recipient_name',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.appt_date || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Appt Date',
      align: 'start',
      value: 'score.appt_date',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.appt_time || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Appt Time',
      align: 'start',
      value: 'score.appt_time',
    },
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.call_status || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Call Status',
      align: 'start',
      value: 'call_status',
    },
    {
      width: '150px',
      upload: {
        value: (value: any, item: any) => {
          return upperFirst(item?.score?.booked_appointment) || ''
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Disposition',
      align: 'start',
      value: 'score.booked_appointment',
    },
    {
      width: '180px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '10px',
        },
      },
      text: 'Duration',
      align: 'start',
      value: 'call_duration',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.comment || ''
        },
        styles: {
          width: '50px',
        },
      },
      text: 'Comment',
      align: 'start',
      value: 'score.comment',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => {
          return callAudio(item?.call_url)
        },
        styles: {
          width: '85px',
        },
      },
      text: 'URL',
      // displayInExcel: false,
      value: 'call_url',
    },
    // {
    //   width: '250px',
    //   upload: {
    //     value: (value: any, item: any) => item?.other_details?.rule || '',
    //     styles: {},
    //   },
    //   text: 'Rule',
    //   displayInExcel: false,
    //   value: 'other_details.rule',
    // },
  ]
}

export const ldr_SEO_CallsColumns = () => {
  return [
    {
      width: '80px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'call_start',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '22px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'caller_name',
    },
    {
      width: '120px',
      upload: {
        value: (value: any) => upperFirst(value),
        styles: {
          width: '10px',
        },
      },
      text: 'Lead source',
      align: 'start',
      value: 'other_details.lead_source',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '23px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
    },
    // usPhone(call.other_details.marketing_number)

    {
      width: '170px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item.caller_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Caller Number',
      align: 'start',
      value: 'caller_number',
    },
    {
      width: '170px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item?.other_details?.marketing_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Marketing Number',
      align: 'start',
      value: 'marketing_number',
    },
    {
      width: '220px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Caller Name',
      align: 'start',
      value: 'caller_name',
    },
    {
      width: '220px',
      upload: {
        value: (value: any, item: any) => {
          return usPhone(item?.other_details?.answering_number)
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Answering Number',
      align: 'start',
      value: 'answering_number',
    },
    {
      upload: {
        value: (value: any, item: any) => {
          return moment(item.call_start).format('dddd')
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Day',
      align: 'start',
      value: 'day',
      width: '120px',
    },
    {
      width: '200px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.person_name
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Patient`s Name',
      align: 'start',
      value: 'score.person_name',
    },
    {
      width: '200px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.who_answered
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Who Answered',
      align: 'start',
      value: 'score.who_answered',
    },
    {
      width: '200px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.procedure?.name || ''
        },
        styles: {
          width: '13px',
        },
      },
      text: 'Procedure',
      align: 'start',
      value: 'score.procedure.name',
    },
    {
      width: '150px',
      upload: {
        value: (value: any, item: any) => {
          return upperFirst(item?.score?.booked_appointment) || ''
        },
        styles: {
          width: '10px',
        },
      },
      text: 'Disposition',
      align: 'start',
      value: 'score.booked_appointment',
    },
    {
      width: '180px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '10px',
        },
      },
      text: 'Duration',
      align: 'start',
      value: 'call_duration',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => {
          return item?.score?.comment || ''
        },
        styles: {
          width: '50px',
        },
      },
      text: 'Comment',
      align: 'start',
      value: 'score.comment',
    },
    {
      width: '250px',
      upload: {
        value: (value: any, item: any) => {
          return callAudio(item?.call_url)
        },
        styles: {
          width: '85px',
        },
      },
      text: 'URL',
      // displayInExcel: false,
      value: 'call_url',
    },
    // {
    //   width: '250px',
    //   upload: {
    //     value: (value: any, item: any) => item?.other_details?.rule || '',
    //     styles: {},
    //   },
    //   text: 'Rule',
    //   displayInExcel: false,
    //   value: 'other_details.rule',
    // },
  ]
}

export const ldr_PPC_FormsColumns = () => {
  return [
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          console.log(item)
          return value
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'date',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'lead.name',
    },
    {
      width: '170px',      upload: {
        value: (value: any) => usPhone(value),
        styles: {
          width: '13px',
        },
      },
      text: 'Lead phone',
      align: 'start',
      value: 'lead.phone',
    },
    {
      width: '270px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Lead email',
      align: 'start',
      value: 'lead.email',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '23px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
      displayInExcel: false,
    },
    {width: '220px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '14px',
        },
      },
      text: 'Procedure',
      align: 'start',
      value: 'lead.procedure',
    },
    {
      width: '150px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '40px',
        },
      },
      text: 'Website',
      align: 'start',
      value: 'lead.page_visited',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '40px',
        },
      },
      text: `Lead Message`,
      align: `middle`,
      sortable: false,
      value: `lead.message`,
    },
  ]
}

export const ldr_FB_FormsColumns = () => {
  return [
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          console.log(item)
          return value
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'date',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'lead.name',
    },
    {
      width: '170px',      upload: {
        value: (value: any) => usPhone(value),
        styles: {
          width: '13px',
        },
      },
      text: 'Lead phone',
      align: 'start',
      value: 'lead.phone',
    },
    {
      width: '270px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Lead email',
      align: 'start',
      value: 'lead.email',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '23px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
      displayInExcel: false,
    },
    {width: '220px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '14px',
        },
      },
      text: 'Procedure',
      align: 'start',
      value: 'lead.procedure',
    },
    {
      width: '150px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '40px',
        },
      },
      text: 'Website',
      align: 'start',
      value: 'lead.page_visited',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '40px',
        },
      },
      text: `Lead Message`,
      align: `middle`,
      sortable: false,
      value: `lead.message`,
    },
  ]
}

export const ldr_SEO_FormsColumns = () => {
  return [
    {
      width: '80px',
      upload: {
        value: (value: any, item: any) => {
          console.log(item)
          return value
        },
        styles: {
          width: '20px',
        },
      },
      text: 'Lead date',
      align: 'start',
      value: 'date',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '20px',
        },
      },
      text: 'Lead name',
      align: 'start',
      value: 'lead.name',
    },
    {
      width: '170px',      upload: {
        value: (value: any) => usPhone(value),
        styles: {
          width: '13px',
        },
      },
      text: 'Lead phone',
      align: 'start',
      value: 'lead.phone',
    },
    {
      width: '270px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '17px',
        },
      },
      text: 'Lead email',
      align: 'start',
      value: 'lead.email',
    },
    {
      width: '250px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '23px',
        },
      },
      text: 'Location',
      align: 'start',
      value: 'location_name',
      displayInExcel: false,
    },
    {width: '220px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '14px',
        },
      },
      text: 'Procedure',
      align: 'start',
      value: 'lead.procedure',
    },
    {
      width: '150px',
      upload: {
        value: (value: any) => value,
        styles: {
          width: '40px',
        },
      },
      text: 'Website',
      align: 'start',
      value: 'lead.page_visited',
    },
    {
      upload: {
        value: (value: any) => value,
        styles: {
          width: '40px',
        },
      },
      text: `Lead Message`,
      align: `middle`,
      sortable: false,
      value: `lead.message`,
    },
  ]
}
