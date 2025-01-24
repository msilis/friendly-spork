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
  class_students: string[];
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
  description?: string | null;
}
