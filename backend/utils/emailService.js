const nodemailer = require('nodemailer')

// Configure transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Email templates
const emailTemplates = {
  enrollmentConfirmation: (userName, programTitle, tier) => ({
    subject: `Enrollment Confirmation - ${programTitle}`,
    html: `
      <h2>Welcome to ${programTitle}!</h2>
      <p>Dear ${userName},</p>
      <p>Your enrollment has been confirmed for the ${tier} tier.</p>
      <p>You can now access all course materials and sessions.</p>
      <p>Happy learning!</p>
      <p>Best regards,<br/>TaleHub Team</p>
    `,
  }),

  programCompletion: (userName, programTitle) => ({
    subject: `Certificate Ready - ${programTitle}`,
    html: `
      <h2>Congratulations!</h2>
      <p>Dear ${userName},</p>
      <p>You have successfully completed the ${programTitle} program!</p>
      <p>Your certificate is ready for download from your dashboard.</p>
      <p>We hope you enjoyed the learning experience.</p>
      <p>Best regards,<br/>TaleHub Team</p>
    `,
  }),

  sessionReminder: (userName, programTitle, sessionTitle, startTime) => ({
    subject: `Reminder: Upcoming Session - ${sessionTitle}`,
    html: `
      <h2>Upcoming Session Reminder</h2>
      <p>Dear ${userName},</p>
      <p>This is a reminder that you have an upcoming session:</p>
      <p><strong>${sessionTitle}</strong></p>
      <p>Program: ${programTitle}</p>
      <p>Starting: ${new Date(startTime).toLocaleString()}</p>
      <p>Join us soon!</p>
      <p>Best regards,<br/>TaleHub Team</p>
    `,
  }),

  enrollmentReminder: (userName, programTitle) => ({
    subject: `Complete Your Learning - ${programTitle}`,
    html: `
      <h2>Don't Fall Behind!</h2>
      <p>Dear ${userName},</p>
      <p>We noticed you haven't been active in ${programTitle} lately.</p>
      <p>Continue your learning journey and complete the remaining sessions.</p>
      <p><a href="${process.env.FRONTEND_URL}/programs/${programTitle}">Continue Learning</a></p>
      <p>Best regards,<br/>TaleHub Team</p>
    `,
  }),

  newEnrollmentNotification: (instructorName, programTitle, studentName) => ({
    subject: `New Enrollment - ${programTitle}`,
    html: `
      <h2>New Student Enrollment</h2>
      <p>Dear ${instructorName},</p>
      <p>A new student has enrolled in your program:</p>
      <p><strong>${studentName}</strong> enrolled in <strong>${programTitle}</strong></p>
      <p>Check your instructor dashboard for more details.</p>
      <p>Best regards,<br/>TaleHub Team</p>
    `,
  }),

  passwordReset: (userName, resetLink) => ({
    subject: 'Password Reset Request',
    html: `
      <h2>Reset Your Password</h2>
      <p>Dear ${userName},</p>
      <p>You have requested to reset your password. Click the link below:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br/>TaleHub Team</p>
    `,
  }),
}

// Send email function
exports.sendEmail = async (to, templateName, templateData) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email service not configured - skipping email send')
      return { success: true, message: 'Email service not configured' }
    }

    const template = emailTemplates[templateName]
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`)
    }

    const emailContent = template(...templateData)

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

// Send enrollment confirmation
exports.sendEnrollmentConfirmation = async (user, program, tier) => {
  return exports.sendEmail(user.email, 'enrollmentConfirmation', [user.name, program.title, tier])
}

// Send program completion notification
exports.sendCompletionNotification = async (user, program) => {
  return exports.sendEmail(user.email, 'programCompletion', [user.name, program.title])
}

// Send session reminder
exports.sendSessionReminder = async (user, program, session) => {
  return exports.sendEmail(user.email, 'sessionReminder', [
    user.name,
    program.title,
    session.title,
    session.startTime,
  ])
}

// Send enrollment reminder (inactive students)
exports.sendEnrollmentReminder = async (user, program) => {
  return exports.sendEmail(user.email, 'enrollmentReminder', [user.name, program.title])
}

// Send new enrollment notification to instructor
exports.sendInstructorNotification = async (instructor, program, student) => {
  return exports.sendEmail(instructor.email, 'newEnrollmentNotification', [
    instructor.name,
    program.title,
    student.name,
  ])
}

// Send password reset email
exports.sendPasswordReset = async (user, resetLink) => {
  return exports.sendEmail(user.email, 'passwordReset', [user.name, resetLink])
}
