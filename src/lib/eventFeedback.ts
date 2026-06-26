export type EventFeedbackFormData = {
  full_name: string;
  business_name: string;
  instagram_handle: string;
  contact_number: string;
  join_reason: string;
  experience: string;
  expectations: string;
  requested_support: string;
  improvement_areas: string;
  suggestions: string;
  final_message: string;
};

export type EventFeedbackRecord = EventFeedbackFormData & {
  id: string;
  created_at: string;
  updated_at: string;
};

export const eventFeedbackInitialFormData: EventFeedbackFormData = {
  full_name: "",
  business_name: "",
  instagram_handle: "",
  contact_number: "",
  join_reason: "",
  experience: "",
  expectations: "",
  requested_support: "",
  improvement_areas: "",
  suggestions: "",
  final_message: "",
};

export const toNullableFeedbackValue = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};
