import { useState, type FormEvent } from 'react';

interface ApplicationFormProps {
  onSubmit: (formData: { name: string; email: string; phone?: string }, resumeFile: File) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

export default function ApplicationForm({ onSubmit, submitting, error }: ApplicationFormProps) {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
      <div className="mb-6">
        <button
          type="button"
          className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          style={{ background: 'linear-gradient(270deg, #6B46C1 0%, #5A3E85 100%)' }}
        >
          Apply Now
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john@example.com"
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 234 567 8900"
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
            Resume/CV <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="file"
              id="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                file:cursor-pointer cursor-pointer"
              required
              disabled={submitting}
            />
            {resume && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {resume.name}
              </p>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            PDF or Word document (max 5MB)
          </p>
        </div>

        {(formError || error) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{formError || error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          style={{ background: submitting ? '#9CA3AF' : 'linear-gradient(270deg, #6B46C1 0%, #5A3E85 100%)' }}
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>

      <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
        By submitting, you agree to our terms and privacy policy
      </p>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your data is secure with us</span>
        </div>
      </div>
    </div>
  );
}
