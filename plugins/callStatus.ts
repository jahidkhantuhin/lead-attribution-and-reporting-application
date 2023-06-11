import Vue from 'vue'
import { get } from 'lodash'

export const callStatus = (val: string) => {
  const booked_appointment = get(val, 'score.booked_appointment', '')
  switch (val) {
    case 'live_answer' : 
    switch (true) {
        case booked_appointment.includes('yes') :
            return 'Live Answer Booked'
        case booked_appointment.includes('cancel') :
            return 'Cancel'
            case booked_appointment.includes('reschedule') :
                return 'Reschedule'
        case booked_appointment.includes('confirm') :
            return 'Confirm'
        case booked_appointment.includes('no') :
            return 'Live Answer Not Booked'
    }
    case 'technical_issues' :
        return 'Technical Issues'
    case 'technical_issue_spam_robocall_hangup' :
        return 'Technical Issue / Spam / Robocall / Hangup'
    case 'voice_mail' :
        return 'Voice Mail'
    case 'no_answer_hangup' :
        return 'No Answer Hangup'
    case 'live_answer_booked' :
        return 'live Answer Booked'
    case 'live_answer_not_booked' :
        return 'live Answer Not Booked'
    case 'voice_mail_require_appointment' :
        return 'Voicemail Require Appointment'
    case 'voice_mail_not_require_appointment' :
        return 'Voicemail Not Require Appointment'
    case 'confirmed_appointment' :
        return 'Confirmed Appointment'
    case 'wrong_number' :
        return 'Wrong Number'
    case 'cancel' :
        return 'Cancel'
    case 'reschedule' :
        return 'Reschedule'
    case 'info_request' :
        return 'Info Request'
    case 'live_answer_lead_booked' :
        return 'Live answer lead booked'
    case 'live_answer_lead_not_booked' :
        return 'Live answer lead not booked'
    case 'reschedule_cancel_confirm' :
        return 'Reschedule / Cancel / Confirm'
    case 'vendor' :
        return 'Vendor'
    case 'others' :
        return 'Others'
    case 'message_left_no_lead' :
        return 'Voicemail - Message left: no lead'
    case 'message_left_lead' :
        return 'Voicemail - Message left: lead'
    case 'voiceMail_no_lead' :
        return 'Voicemail - no lead'
    default:
      break
  }
}

Vue.filter('callStatus', (val: string) => {
  return callStatus(val)
})
