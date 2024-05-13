// server.js

const express = require('express');
const mongoose = require('mongoose');
const qrcode = require('qrcode');
// const router=express.Router();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  schoolName: String,
  qrCode: String, // Store the QR code image URL
});

const UserModel = mongoose.model('User', UserSchema);

app.use(bodyParser.json());

app.post('/api/generate-qr', async (req, res) => {
  try {
    const { username, schoolName } = req.body;

    // Generate QR code
    const qrCodeData = `${username} - ${schoolName}`;
    const qrCodeImage = await qrcode.toDataURL(qrCodeData);

    // Save user data and QR code URL to MongoDB
    const newUser = new UserModel({
      username,
      schoolName,
      qrCode: qrCodeImage,
    });
    await newUser.save();

    res.status(200).json({ qrCodeImage });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
