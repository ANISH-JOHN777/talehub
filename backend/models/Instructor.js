const mongoose = require('mongoose')

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide instructor name'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    expertise: [
      {
        type: String,
      },
    ],
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150?text=Instructor',
    },
    social: {
      twitter: String,
      linkedin: String,
      website: String,
    },
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
      },
    ],
    totalStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Instructor', instructorSchema)
