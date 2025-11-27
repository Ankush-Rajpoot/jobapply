const HASURA_ENDPOINT = import.meta.env.VITE_HASURA_ENDPOINT || 'https://arc.vocallabs.ai/v1/graphql';
const HASURA_SECRET = import.meta.env.VITE_HASURA_SECRET || 'legalpwd123';
const CAMPAIGN_SERVICE_URL = import.meta.env.VITE_CAMPAIGN_SERVICE_URL || 'https://campaign.vocallabs.ai';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function makeGraphQLRequest<T>(query: string, variables: any = {}): Promise<T> {
  const response = await fetch(HASURA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': HASURA_SECRET,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL Error');
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL');
  }

  return result.data;
}

export async function getJobById(jobId: string) {
  const query = `
    query GetJobById($jobId: uuid!) {
      vocallabs_hr2_posts_by_pk(id: $jobId) {
        id
        client_id
        job_role
        description
        location
        ctc
        ctc_minimum
        ctc_maximum
        experience_minimum_needed
        experience_maximum_needed
        work_mode
        number_of_openings
        created_at
        status
      }
    }
  `;

  const result = await makeGraphQLRequest<{ vocallabs_hr2_posts_by_pk: any }>(query, { jobId });

  if (!result.vocallabs_hr2_posts_by_pk) {
    return null;
  }

  const job = result.vocallabs_hr2_posts_by_pk;

  // Fetch company profile using client_id from vocallabs_hr2_company
  let companyName = 'Company';
  let companyWebsite = '';
  if (job.client_id) {
    const companyQuery = `
      query GetCompanyInfo($clientId: uuid!) {
        vocallabs_hr2_company(where: {client_id: {_eq: $clientId}}, limit: 1) {
          name
          website
        }
      }
    `;

    try {
      const companyResult = await makeGraphQLRequest<{ vocallabs_hr2_company: any[] }>(companyQuery, { clientId: job.client_id });
      console.log('📊 Company data fetched:', companyResult);
      if (companyResult.vocallabs_hr2_company && companyResult.vocallabs_hr2_company.length > 0) {
        companyName = companyResult.vocallabs_hr2_company[0].name || 'Company';
        companyWebsite = companyResult.vocallabs_hr2_company[0].website || '';
      }
    } catch (error) {
      console.warn('Could not fetch company info:', error);
    }
  }

  return {
    id: job.id,
    client_id: job.client_id,
    job_role: job.job_role,
    job_description: job.description,
    location: job.location,
    ctc: job.ctc,
    min_ctc: job.ctc_minimum,
    max_ctc: job.ctc_maximum,
    min_experience: job.experience_minimum_needed,
    max_experience: job.experience_maximum_needed,
    work_mode: job.work_mode,
    number_of_openings: job.number_of_openings,
    created_at: job.created_at,
    status: job.status,
    company_name: companyName,
    company_website: companyWebsite,
  };
}

export async function submitApplication(
  jobId: string,
  _jobTitle: string,
  clientId: string,
  formData: {
    name: string;
    email: string;
    phone?: string;
    notice_period_days?: number;
    current_salary?: number;
    expected_salary?: number;
  },
  resumeFile: File
) {
  const formDataToSend = new FormData();

  // Add the resume file with correct field name
  formDataToSend.append('resume', resumeFile);

  // Create request object matching the backend structure
  const requestData: any = {
    client_id: clientId,
    job_id: jobId,
    candidate_name: formData.name,
    candidate_email: formData.email,
    candidate_phone: formData.phone || '',
    cover_letter: ''
  };

  // Add optional fields if provided
  if (formData.notice_period_days !== undefined && formData.notice_period_days !== null) {
    requestData.notice_period_days = formData.notice_period_days;
  }
  if (formData.current_salary !== undefined && formData.current_salary !== null) {
    requestData.current_salary = formData.current_salary;
  }
  if (formData.expected_salary !== undefined && formData.expected_salary !== null) {
    requestData.expected_salary = formData.expected_salary;
  }

  // Add request data as JSON string
  formDataToSend.append('request', JSON.stringify(requestData));

  const apiUrl = `${CAMPAIGN_SERVICE_URL}/hr_handler/process-single-resume`;

  console.log('📝 Submitting application:', {
    job_id: jobId,
    client_id: clientId,
    candidate_name: formData.name,
    candidate_email: formData.email,
    apiUrl
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formDataToSend,
    // Don't set Content-Type, let browser set it with boundary for FormData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit application: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log('✅ Application submitted successfully:', result);

  return result;
}
