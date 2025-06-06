export interface StudentRecord {
  id?: number;
  first_name: string;
  last_name: string;
  birthdate: string;
  family_id?: number;
  teacher_id?: number;
}

export interface FamilyRecord {
  id?: number;
  family_last_name: string;
  parent1_first_name: string;
  parent1_last_name: string;
  parent1_email: string;
  parent1_mobile_phone?: string;
  parent2_first_name?: string | null;
  parent2_last_name?: string | null;
  parent2_email?: string | null;
  parent2_mobile_phone?: string | null;
  parent1_address?: string | null;
  parent2_address?: string | null;
  alternate_contact_name?: string | null;
  alternate_contact_email?: string | null;
  alternate_contact_mobile_phone?: string | null;
}

export interface TeacherRecord {
  id?: number;
  teacher_first_name: string;
  teacher_last_name: string;
  teacher_email: string;
  teacher_mobile_phone: string;
  teacher_address: string;
  is_teacher_accompanist?: string | number;
}

export interface ClassRecord {
  id?: number;
  class_name: string;
  class_location: string;
  class_start_time: string;
  class_end_time: string;
  class_students: number[];
  class_teacher: number;
  class_accompanist: number;
}

export interface SelectOption {
  value: number | string;
  name: string;
}

export interface TransactionRecord {
  id?: number;
  account_id: number;
  transaction_date: string;
  transaction_amount: number | string;
  transaction_type: "payment" | "charge" | "refund" | "discount" | "";
  transaction_description?: string;
}

export interface InvoiceRecord {
  invoice_id?: number;
  invoice_number: number | string;
  account_id: number;
  invoice_date: string;
  total_amount: number | string;
  invoice_status?: string;
}

export interface InvoiceItemRecord {
  invoice_item_id?: number;
  invoice_id: number;
  item_type: "charge" | "payment" | "refund" | "discount";
  item_description?: string;
  item_amount: number;
}

export type SaveDataType = {
  invoice: InvoiceRecord;
  transactions: TransactionRecord;
};

export interface FetcherData {
  success: boolean;
  message: string | undefined;
}

export type IntentHandler = (
  formData: FormData
) => Promise<Response | undefined>;
