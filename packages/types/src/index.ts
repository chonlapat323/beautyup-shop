export type InquiryType =
  | 'CONTACT'
  | 'ORDER'
  | 'SALON'
  | 'COURSE'
  | 'ISSUE'
  | 'PP_STUDIO';

export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'DONE';

export interface ApiError {
  statusCode: number;
  message: string | string[];
}
