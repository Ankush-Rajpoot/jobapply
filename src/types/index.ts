export type Job = {
  id: string;
  client_id: string;
  job_role: string;
  job_description: string;
  location: string;
  ctc: string;
  min_ctc?: number;
  max_ctc?: number;
  min_experience: number;
  max_experience: number;
  work_mode: string;
  number_of_openings?: number;
  created_at?: string;
  status?: string;
  company_name?: string;
  company_logo?: string;
  company_website?: string;
};

export type ApplicationFormData = {
  name: string;
  email: string;
  phone: string;
  resume: File | null;
  notice_period_days?: number;
  current_salary?: number;
  expected_salary?: number;
};
