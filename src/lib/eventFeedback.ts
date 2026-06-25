export type EventFeedbackFormData = {
  full_name: string;
  business_name: string;
  social_handle: string;
  contact_number: string;
  joined_reason: string;
  experience: string;
  expectations: string;
  requested_support: string;
  improvement_areas: string;
  suggestions: string;
  final_message: string;
  consent: boolean;
};

export type EventFeedbackRecord = EventFeedbackFormData & {
  id: string;
  created_at: string;
  updated_at: string;
};

export const eventFeedbackInitialFormData: EventFeedbackFormData = {
  full_name: "",
  business_name: "",
  social_handle: "",
  contact_number: "",
  joined_reason: "",
  experience: "",
  expectations: "",
  requested_support: "",
  improvement_areas: "",
  suggestions: "",
  final_message: "",
  consent: false,
};

export const toNullableFeedbackValue = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};
