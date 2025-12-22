"use client";

export default function StudentDetailModal({ isOpen, onClose, alumni, results }) {
  if (!isOpen || !alumni) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Student Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {alumni.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">{alumni.name}</h3>
              <p className="text-gray-600">{alumni.email}</p>
              {alumni.phone && (
                <p className="text-gray-500 mt-1">📞 {alumni.phone}</p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alumni.fatherName && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Father's Name</p>
                  <p className="text-gray-800 font-medium">{alumni.fatherName}</p>
                </div>
              )}
              {alumni.motherName && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Mother's Name</p>
                  <p className="text-gray-800 font-medium">{alumni.motherName}</p>
                </div>
              )}
              {alumni.createdAt && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Joined Date</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(alumni.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Results History */}
          {results && results.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Results History</h4>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {result.class} - {result.academicYear}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {result.semester}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Total Marks</p>
                        <p className="text-xl font-bold text-blue-600">
                          {result.subjects.reduce(
                            (sum, s) => sum + (s.marksObtained || 0),
                            0
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex flex-wrap gap-2">
                        {result.subjects.map((subject, subIndex) => (
                          <span
                            key={subIndex}
                            className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {subject.subjectName}: {subject.marksObtained}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

