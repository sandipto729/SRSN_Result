"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alumni, setAlumni] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.user?.role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }
    if (session.user?.role !== "student") {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch alumni data
        const alumniRes = await axios.get(`/api/alumni?email=${session.user.email}`);
        setAlumni(alumniRes.data);

        // Fetch available filters
        const filtersRes = await axios.get("/api/filters");
        setAvailableFilters(filtersRes.data);

        // Fetch results
        await fetchResults();
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.academicYear) params.append("academicYear", filters.academicYear);
      if (filters.class) params.append("class", filters.class);
      if (filters.semester) params.append("semester", filters.semester);

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
    if (session?.user?.role === "student") {
      fetchResults();
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const calculateTotalMarks = (subjects) => {
    return subjects.reduce((sum, subject) => sum + (subject.marksObtained || 0), 0);
  };

  if (!session || session.user?.role !== "student") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        {alumni && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {alumni.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{alumni.name}</h2>
                <p className="text-gray-600">{alumni.email}</p>
                {alumni.phone && <p className="text-gray-500 text-sm">📞 {alumni.phone}</p>}
              </div>
            </div>
            {(alumni.fatherName || alumni.motherName) && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumni.fatherName && (
                  <div>
                    <p className="text-sm text-gray-500">Father's Name</p>
                    <p className="text-gray-800 font-medium">{alumni.fatherName}</p>
                  </div>
                )}
                {alumni.motherName && (
                  <div>
                    <p className="text-sm text-gray-500">Mother's Name</p>
                    <p className="text-gray-800 font-medium">{alumni.motherName}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Filter Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                value={filters.academicYear}
                onChange={(e) => handleFilterChange("academicYear", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-400 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
              >
                <option value="">All Years</option>
                {availableFilters.academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={filters.class}
                onChange={(e) => handleFilterChange("class", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-400 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
              >
                <option value="">All Classes</option>
                {availableFilters.classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={filters.semester}
                onChange={(e) => handleFilterChange("semester", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-400 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
              >
                <option value="">All Semesters</option>
                {availableFilters.semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem.charAt(0).toUpperCase() + sem.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Results</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl text-gray-600">No results found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {result.class}
                      </h3>
                      <p className="text-gray-600">{result.academicYear}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {result.semester}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Total Marks</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {calculateTotalMarks(result.subjects)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Subjects</h4>
                    <div className="space-y-2">
                      {result.subjects.map((subject, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-gray-700 font-medium">
                            {subject.subjectName}
                          </span>
                          <span className="text-gray-800 font-bold">
                            {subject.marksObtained} / 100
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
