const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/language-school', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema for the students
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    paymentId: String,
    course: String,
    language: String,
    studentId: String
});

const Student = mongoose.model('Student', studentSchema);

app.post('/join', (req, res) => {
    const { name, email, paymentId, course, language } = req.body;

    const studentId = `S-${Date.now()}`;
    const newStudent = new Student({ name, email, paymentId, course, language, studentId });

    // Save student to the database
    newStudent.save((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving to database');
        }

        // Send confirmation email after successful save
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Enrollment Confirmation',
            text: `Congratulations ${name},\n\nThank you for enrolling in our ${language}! You are now succcessfully registered for the (${course}). Your Unique student ID is: ${studentId}.\n\nPlease keep this for your recordsand use it for future reference during classes and exams.\n\nBest regards,\nRichClemon School of Languages`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.send(`Enrollment successful! Check your email for confirmation.`);
            }
        });
    });
});