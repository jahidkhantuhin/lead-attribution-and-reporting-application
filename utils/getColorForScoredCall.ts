import { get } from 'lodash'
import moment, { weekdays } from 'moment'

export const isDateWeekend = (date: string) => {
  const day = moment(date).format('dddd').toLowerCase()
  const weekendDays = ['sunday', 'saturday']
  const is_weekend = weekendDays.includes(day)

  return is_weekend
}

export default function (item: any) {
  const is_weekend = isDateWeekend(item.call_start)

  let color = ''
  const booked_appointment = get(item, 'score.booked_appointment', '')
  const call_status = get(item, 'score.call_status', booked_appointment)
  switch (call_status) {
  case 'live_answer' : 
    switch (true) {
        case booked_appointment.includes('yes') :
            return 'green accent-1'
        case booked_appointment.includes('cancel') :
            return 'blue accent-1'
            case booked_appointment.includes('reschedule') :
                return 'blue accent-1'
        case booked_appointment.includes('confirm') :
            return 'blue accent-1'
        case booked_appointment.includes('no') :
            return 'red accent-1'
    }
    case 'technical_issues' :
        return 'blue accent-1'
    case 'technical_issue_spam_robocall_hangup' :
        return 'blue accent-1'
    case 'voice_mail' :
        return 'yellow accent-1'
    case 'no_answer_hangup' :
        return 'yellow accent-1'
    case 'live_answer_booked' :
        return 'green accent-1'
    case 'live_answer_not_booked' :
        return 'red accent-1'
    case 'voice_mail_require_appointment' :
        return 'orange accent-1'
    case 'voice_mail_not_require_appointment' :
        return 'yellow accent-1'
    case 'confirmed_appointment' :
        return 'blue accent-1'
    case 'wrong_number' :
        return 'blue accent-1'
    case 'cancel' :
        return 'blue accent-1'
    case 'reschedule' :
        return 'blue accent-1'
    case 'info_request' :
        return 'blue accent-1'
    case 'live_answer_lead_booked' :
        return 'green accent-1'
    case 'live_answer_lead_not_booked' :
        return 'red accent-1'
    case 'reschedule_cancel_confirm' :
        return 'blue accent-1'
    case 'vendor' :
        return 'blue accent-1'
    case 'others' :
        return 'blue accent-1'
    case 'message_left_no_lead' :
        return 'yellow accent-1'
    case 'message_left_lead' :
        return 'yellow accent-1'
    case 'voiceMail_no_lead' :
        return 'yellow accent-1'
    
  }

    if (is_weekend) {
      return 'grey lighten-3'
    }

    return color
}
