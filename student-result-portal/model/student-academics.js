const mongoose = require("mongoose");

const StudentAcademicSchema = new mongoose.Schema({
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
    required: true,
    index: true
  },

  class: {
    type: String, // Beez, 1, 2, 3, 4...
    required: true
  },

  academicYear: {
    type: String, // 2024-2025
    required: true
  },

  semester: {
    type: String, // firstSem | secondSem | endSem
    required: true
  },

  subjects: [
    {
      subjectName: String,
      marksObtained: Number
    }
  ],

  isPublished: {
    type: Boolean,
    default: true
  },

  publishedAt: Date
}, { timestamps: true });

module.exports = mongoose.models.StudentAcademic || mongoose.model("StudentAcademic", StudentAcademicSchema);