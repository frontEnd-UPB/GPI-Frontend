export interface VacationFormValues {
  startDate: Date | null;
  endDate: Date | null;
  type: string;
  comment: string;
}

export interface VacationSubmitData extends VacationFormValues {
  attachment: File | null;
}
