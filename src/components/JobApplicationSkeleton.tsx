export default function JobApplicationSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-3 md:px-6 py-4 md:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 md:space-y-8">
            
            {/* Company & Job Title Card Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-8 animate-pulse">
              {/* Company Header */}
              <div className="flex items-start gap-2.5 md:gap-4 mb-3 md:mb-6">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-200 rounded-lg shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 md:h-5 bg-gray-200 rounded w-32 md:w-40 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 md:w-32"></div>
                </div>
              </div>
              
              {/* Job Title */}
              <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4 mb-3 md:mb-6"></div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-start gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-lg shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Apply Button Skeleton */}
              <div className="mt-4 md:mt-6">
                <div className="h-9 md:h-10 bg-gray-200 rounded-lg w-full"></div>
                <div className="mt-3 md:mt-4 flex justify-center">
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>

            {/* Job Description Card Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-8 animate-pulse">
              <div className="h-5 md:h-6 bg-gray-200 rounded w-40 mb-3 md:mb-4"></div>
              
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0 mt-0.5"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0 mt-0.5"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0 mt-0.5"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0 mt-0.5"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0 mt-0.5"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0 mt-0.5"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
