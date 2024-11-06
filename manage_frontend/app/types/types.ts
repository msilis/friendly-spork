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
  parent2_first_name?: string;
  parent2_last_name?: string;
  parent2_email?: string;
  parent2_mobile_phone?: string;
  parent1_address?: string;
  parent2_address?: string;
  alternate_contact_name?: string;
  alternate_contact_email?: string;
  alternate_contact_mobile_phone?: string;
}
