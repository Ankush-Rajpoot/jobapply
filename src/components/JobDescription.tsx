import type { Job } from '../types/index';

interface JobDescriptionProps {
  job: Job;
}

export default function JobDescription({ job }: JobDescriptionProps) {
  // Parse job description into sections
  const sections = job.job_description.split('\n\n');
  
  return (
    <div className="mb-4 md:mb-8">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Job description</h2>
        
        <div className="space-y-6">
          <div className="prose prose-base max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-4">
              {sections.map((section, index) => {
                // Check if section is a list or paragraph
                if (section.includes('•') || section.includes('-')) {
                  const lines = section.split('\n').filter(line => line.trim());
                  const title = lines[0].includes(':') ? lines[0] : null;
                  const cleanTitle = title ? title.replace(/\*\*/g, '').trim() : null;
                  const listItems = title ? lines.slice(1) : lines;
                  
                  return (
                    <div key={index} className="space-y-1.5 md:space-y-2">
                      {cleanTitle && <h3 className="font-semibold text-gray-900 text-base md:text-lg">{cleanTitle}</h3>}
                      <ul className="space-y-2 ml-4">
                        {listItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5 md:gap-2">
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{item.replace(/^[•\-]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                } else if (section.includes(':') && section.split(':')[0].length < 50) {
                  const [title, ...content] = section.split(':');
                  const cleanTitle = title.replace(/\*\*/g, '').trim();
                  return (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-1.5 md:mb-2">{cleanTitle}</h3>
                      <p className="text-sm md:text-base text-gray-700">{content.join(':').trim()}</p>
                    </div>
                  );
                } else {
                  return (
                    <p key={index} className="text-sm md:text-base text-gray-700">
                      {section}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </div>
    </div>
  );
}
