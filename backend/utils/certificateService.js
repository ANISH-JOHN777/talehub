const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

// Create certificates directory if not exists
const certificatesDir = path.join(__dirname, '../certificates')
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true })
}

// Generate certificate PDF
exports.generateCertificate = async (enrollment) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `certificate_${enrollment._id}_${Date.now()}.pdf`
      const filePath = path.join(certificatesDir, fileName)

      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        layout: 'landscape',
      })

      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      // Background color
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f0f0')

      // Border
      doc
        .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
        .lineWidth(3)
        .stroke('#1a5490')

      // Title
      doc
        .fontSize(48)
        .font('Helvetica-Bold')
        .fill('#1a5490')
        .text('Certificate of Completion', 0, 80, {
          align: 'center',
          width: doc.page.width,
        })

      // Decorative line
      doc
        .moveTo(200, 140)
        .lineTo(doc.page.width - 200, 140)
        .stroke('#1a5490')
        .lineWidth(1)

      // Message
      doc
        .fontSize(14)
        .font('Helvetica')
        .fill('#333333')
        .text('This certifies that', 0, 170, {
          align: 'center',
          width: doc.page.width,
        })

      // Student name
      doc
        .fontSize(32)
        .font('Helvetica-Bold')
        .fill('#1a5490')
        .text(enrollment.user.name || 'Student', 0, 210, {
          align: 'center',
          width: doc.page.width,
        })

      // Completion message
      doc
        .fontSize(14)
        .font('Helvetica')
        .fill('#333333')
        .text('Has successfully completed the course', 0, 260, {
          align: 'center',
          width: doc.page.width,
        })

      // Program title
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .fill('#1a5490')
        .text(enrollment.program.title, 0, 295, {
          align: 'center',
          width: doc.page.width,
        })

      // Program details
      const completedDate = enrollment.completedAt ? new Date(enrollment.completedAt).toLocaleDateString() : new Date().toLocaleDateString()
      doc
        .fontSize(11)
        .font('Helvetica')
        .fill('#666666')
        .text(`Tier: ${enrollment.tier} | Date: ${completedDate}`, 0, 340, {
          align: 'center',
          width: doc.page.width,
        })

      // Signature line
      doc
        .moveTo(100, 400)
        .lineTo(300, 400)
        .stroke('#333333')

      doc
        .fontSize(10)
        .font('Helvetica')
        .fill('#333333')
        .text('Director, TaleHub', 100, 410, { width: 200, align: 'center' })

      // Certificate ID
      doc
        .fontSize(9)
        .font('Helvetica')
        .fill('#999999')
        .text(`Certificate ID: ${enrollment._id}`, 0, doc.page.height - 60, {
          align: 'center',
          width: doc.page.width,
        })

      // Verification URL
      doc
        .fontSize(8)
        .font('Helvetica')
        .fill('#666666')
        .text(`Verify at: ${process.env.FRONTEND_URL}/verify/${enrollment._id}`, 0, doc.page.height - 35, {
          align: 'center',
          width: doc.page.width,
        })

      doc.end()

      stream.on('finish', () => {
        resolve({
          success: true,
          fileName,
          filePath,
          url: `/certificates/${fileName}`,
        })
      })

      stream.on('error', (err) => {
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// Get certificate file
exports.getCertificateFile = (fileName) => {
  const filePath = path.join(certificatesDir, fileName)
  if (fs.existsSync(filePath)) {
    return filePath
  }
  return null
}

// Delete certificate file
exports.deleteCertificate = (fileName) => {
  const filePath = path.join(certificatesDir, fileName)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    return { success: true }
  }
  return { success: false, error: 'File not found' }
}
