import { useState, type FormEvent } from 'react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  onSubmit: (formData: { name: string; email: string; phone?: string }, resumeFile: File) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

export default function ApplicationModal({ 
  isOpen, 
  onClose, 
  jobTitle, 
  onSubmit, 
  submitting,
  error 
}: ApplicationModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!name.trim()) {
      setFormError('Please enter your name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (!phone.trim()) {
      setFormError('Please enter your phone number');
      return;
    }

    if (!resume) {
      setFormError('Please upload your resume');
      return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resume.type)) {
      setFormError('Please upload a PDF or Word document');
      return;
    }

    // Check file size (5MB max)
    if (resume.size > 5 * 1024 * 1024) {
      setFormError('File size must be less than 5MB');
      return;
    }

    try {
      await onSubmit({ name, email, phone }, resume);
      // Reset form on success
      setName('');
      setEmail('');
      setPhone('');
      setResume(null);
    } catch (err) {
      // Error is handled in parent component
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
      setFormError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white md:bg-black/50">
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-0 md:p-4">
        <div className="relative bg-white md:rounded-xl shadow-2xl w-full md:max-w-lg h-full md:h-auto md:max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-5 py-3 md:py-3 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Apply for this job</h2>
              <p className="text-xs text-gray-600 mt-0.5">{jobTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={submitting}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-3.5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="Enter your full name"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="your.email@example.com"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="+1 (555) 000-0000"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-semibold text-gray-900 mb-1">
                Resume/CV <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <label 
                  htmlFor="resume" 
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <div className="flex flex-col items-center justify-center py-3">
                    <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {resume ? (
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-700">{resume.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {(resume.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">PDF, DOC, DOCX (max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="resume"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    disabled={submitting}
                  />
                </label>
              </div>
            </div>

            {(formError || error) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-red-600">{formError || error}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 text-sm"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center pt-1.5">
              By submitting this form, you confirm that you agree to the storing and processing of your personal data.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
