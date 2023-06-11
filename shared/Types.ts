/* eslint-disable camelcase */
export interface ILDRSummaryItem {
  total: Number
  unique?: Number
}

export interface ILDRSummary {
  calls: ILDRSummaryItem
  emails: ILDRSummaryItem
  chats: ILDRSummaryItem
}

// @TODO: Turn details into a type
export interface ILeadDetailsReport {
  client: Object
  date_start: String
  date_end: String
  summary: ILDRSummary
  details: Object[]
}

export interface IReportPageItem {
  title: String
  link: String
  details: String
  icon?: String
}

export interface AccountManager {
  id: number
  email: string
  first_name: string
  last_name: string
  job_title?: any
  organisation?: any
  phone_number?: any
  address?: any
  pay_rate?: any
  status: number
  created_at: Date
  updated_at: Date
}

export interface Client {
  id?: number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  status?: number
  personal_website?: string
  account_manager?: AccountManager
  account_manager_id?: number
  locations?: any[]
  staff?: any[]
  created_at?: Date
  updated_at?: Date
}

export interface User {
  id: number
  first_name: string
  last_name: string
  fullname: string
  email: string
  job_title?: any
  organisation?: any
  pay_rate?: any
  phone_number?: any
  address?: any
  role: string
  registered: string
  meta: any[]
}
