import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJobById, submitApplication } from '../services/api';
import type { Job } from '../types/index';
import JobDescription from '../components/JobDescription';
import ApplicationModal from '../components/ApplicationModal';
import JobApplicationSkeleton from '../components/JobApplicationSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import Toast from '../components/Toast';

export default function JobApplicationPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadJob(jobId);
    }
  }, [jobId]);

  const loadJob = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const jobData = await getJobById(id);
      
      if (!jobData) {
        setError('Job not found');
        setJob(null);
      } else {
        setJob(jobData);
      }
    } catch (err) {
      console.error('Error loading job:', err);
      setError(err instanceof Error ? err.message : 'Failed to load job');
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: { name: string; email: string; phone?: string }, resumeFile: File) => {
    if (!job) return;

    try {
      setSubmitting(true);
      setError(null);

      await submitApplication(
        job.id,
        job.job_role,
        job.client_id,
        formData,
        resumeFile
      );

      setIsModalOpen(false);
      setHasApplied(true);
      setToast({
        message: `Application submitted successfully for ${job.job_role}! We'll be in touch soon.`,
        type: 'success'
      });
    } catch (err) {
      console.error('Error submitting application:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      setError(errorMessage);
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <JobApplicationSkeleton />;
  }

  if (error && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <ErrorMessage message="Job not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-3 md:px-6 py-4 md:py-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Job Details */}
          <div className="space-y-4 md:space-y-8">
            
            {/* Company & Job Title */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-8">
              <div className="flex items-start gap-2.5 md:gap-4 mb-3 md:mb-6">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white font-semibold text-base md:text-xl">
                    {job.company_name?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm md:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">{job.company_name}</h2>
                  {job.company_website && (
                    <a
                      href={job.company_website.startsWith('http') ? job.company_website : `https://${job.company_website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      Visit company website
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-6">{job.job_role}</h1>
              
              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Location</div>
                    <div className="text-sm font-medium text-gray-900">{job.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Work Mode</div>
                    <div className="text-sm font-medium text-gray-900 capitalize">{job.work_mode}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Type</div>
                    <div className="text-sm font-medium text-gray-900">Full-time</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Salary</div>
                    <div className="text-sm font-medium text-gray-900">
                      {job.min_ctc && job.max_ctc 
                        ? `₹${job.min_ctc.toLocaleString()} - ₹${job.max_ctc.toLocaleString()}`
                        : job.ctc}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Experience</div>
                    <div className="text-sm font-medium text-gray-900">{job.min_experience} - {job.max_experience} years</div>
                  </div>
                </div>
              </div>

              {job.number_of_openings && job.number_of_openings > 1 && (
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Hiring {job.number_of_openings} candidates for this position</span>
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="mt-4 md:mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={hasApplied}
                  className={`w-full px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold transition-colors shadow-sm text-sm ${
                    hasApplied
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {hasApplied ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Applied Successfully
                    </span>
                  ) : (
                    'Apply for this position'
                  )}
                </button>
                <div className="mt-3 md:mt-4 text-center">
                  <div className="text-xs md:text-sm text-gray-500">
                    Powered by{' '}
                    <a
                      href="https://hiringg.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-900 hover:opacity-80 transition-opacity"
                    >
                      Hiringg.ai
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-8">
              <JobDescription job={job} />
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={job.job_role}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}