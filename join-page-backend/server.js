const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/language-school', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
    },
});

const upload = multer({ storage });

// Route to handle student registration (join)
app.post('/join', (req, res) => {
    const { name, email, duration, course, language } = req.body;

    const studentId = `S-${Date.now()}`;
    const newStudent = new Student({ name, email, duration, course, language, studentId });

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
                user: 'richclemonschooloflanguages@gmail.com', // Your email
                pass: 'Rich-Clemon#..$!!1', // Your email password
            },
        });

        const mailOptions = {
            from: 'richclemonschooloflanguages@gmail.com', // Email you are sending from
            to: email, // Student's email
            subject: 'Enrollment Confirmation',
            text: `Congratulations ${name},\n\nThank you for enrolling in our ${language}! You are now successfully registered for the (${course}) for a duration of ${duration}. Your Unique student ID is: ${studentId}.\n\nPlease keep this for your records and payment purposes.\n\nBest regards,\nRichClemon School of Languages`,
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

// Route to handle contact form submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email, // Student's email
        to: 'richclemonschooloflanguages@gmail.com', // Your email to receive messages
        subject: `Message from ${name}`,
        text: message,
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'richclemonschooloflanguages@gmail.com',
            pass: 'Rich-Clemon#..$!!1',
        },
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Message sent: ' + info.response);
        res.send('Your message has been sent successfully!');
    });
});

// Route to handle receipt upload
app.post('/upload-receipt', upload.single('receipt'), (req, res) => {
    const { studentId } = req.body;
    const receiptPath = req.file.path; // Path of the uploaded receipt

    const mailOptions = {
        from: 'richclemonschooloflanguages@gmail.com',
        to: 'richclemonschooloflanguages@gmail.com', // Your email to receive payment completion notifications
        subject: 'Payment Receipt Submitted',
        text: `A payment receipt has been uploaded for student ID: ${studentId}`,
        attachments: [{
            filename: req.file.originalname,
            path: receiptPath,
        }],
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'richclemonschooloflanguages@gmail.com',
            pass: 'Rich-Clemon#..$!!1',
        },
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Payment receipt email sent: ' + info.response);
        res.send('Receipt uploaded successfully!');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});