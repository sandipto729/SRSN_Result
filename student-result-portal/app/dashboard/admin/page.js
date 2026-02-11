"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import StudentDetailModal from "@/components/StudentDetailModal";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    academicYear: "",
    class: "",
    semester: "",
  });
  const [availableFilters, setAvailableFilters] = useState({
    academicYears: [],
    classes: [],
    semesters: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [alumniResults, setAlumniResults] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.user?.role === "student") {
      router.replace("/dashboard/student");
      return;
    }
    if (session.user?.role !== "admin") {
      router.replace("/login");
      return;
    }

    const fetchFilters = async () => {
      try {
        const res = await axios.get("/api/filters");
        setAvailableFilters(res.data);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchFilters();
  }, [session, status, router]);

  const fetchResults = async () => {
    if (!filters.academicYear || !filters.class || !filters.semester) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("academicYear", filters.academicYear);
      params.append("class", filters.class);
      params.append("semester", filters.semester);

      const res = await axios.get(`/api/results?${params.toString()}`);
      setResults(res.data.results || []);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchResults();
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const calculateTotalMarks = (subjects) => {
    return subjects.reduce((sum, subject) => {
      const marks = subject.marksObtained === -1 ? 0 : (subject.marksObtained || 0);
      return sum + marks;
    }, 0);
  };

  const handleStudentClick = async (alumniId, email) => {
    try {
      // Fetch full alumni details
      const alumniRes = await axios.get(`/api/alumni?email=${email}`);
      
      // Fetch all results for this student
      const resultsRes = await axios.get(`/api/results?email=${email}`);
      
      setSelectedAlumni(alumniRes.data);
      setAlumniResults(resultsRes.data.results || []);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching student details:", err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlumni(null);
    setAlumniResults([]);
  };

  if (!session || session.user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">View and manage student results</p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Select Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                value={filters.academicYear}
                onChange={(e) => handleFilterChange("academicYear", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-400 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
              >
                <option value="">Select Academic Year</option>
                {availableFilters.academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={filters.class}
                onChange={(e) => handleFilterChange("class", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-400 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
              >
                <option value="">Select Class</option>
                {availableFilters.classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={filters.semester}
                onChange={(e) => handleFilterChange("semester", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-400 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
              >
                <option value="">Select Semester</option>
                {availableFilters.semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem.charAt(0).toUpperCase() + sem.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Student Results</h2>
            {results.length > 0 && (
              <span className="text-gray-600 font-medium">
                {results.length} {results.length === 1 ? "student" : "students"}
              </span>
            )}
          </div>

          {!filters.academicYear || !filters.class || !filters.semester ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600">Please select all filters to view results</p>
              <p className="text-gray-500 mt-2">Choose Academic Year, Class, and Semester</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl text-gray-600">No results found</p>
              <p className="text-gray-500 mt-2">No students found for the selected filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <th className="px-6 py-4 text-left font-semibold rounded-tl-lg">Student Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Phone</th>
                    <th className="px-6 py-4 text-center font-semibold">Total Marks</th>
                    <th className="px-6 py-4 text-center font-semibold rounded-tr-lg">Subjects</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                            {result.alumniId?.name?.charAt(0)?.toUpperCase() || "S"}
                          </div>
                          <button
                            onClick={() => handleStudentClick(result.alumniId?._id, result.alumniId?.email)}
                            className="font-medium text-gray-800 hover:text-blue-600 hover:underline cursor-pointer transition-colors text-left"
                          >
                            {result.alumniId?.name || "N/A"}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{result.alumniId?.email || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-700">{result.alumniId?.phone || "N/A"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-blue-600 text-lg">
                          {calculateTotalMarks(result.subjects)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {result.subjects.map((subject, subIndex) => (
                            <span
                              key={subIndex}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                subject.marksObtained === -1
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {subject.subjectName}: {subject.marksObtained === -1 ? "Absent" : `${subject.marksObtained}`}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        alumni={selectedAlumni}
        results={alumniResults}
      />
    </div>
  );
}
