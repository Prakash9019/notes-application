// UserForm.js

import React, { useState } from 'react';

const UserForm = () => {
  const [username, setUsername] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [scannedUserId, setScannedUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const handleScan = async (qrCodeImage) => {
    // console.log(data.target.value);
    setScannedUserId(qrCodeImage); // Assuming data contains the user ID
    const userIdToFind = 2;
    // const foundObject = data.find((obj) => obj.id === userIdToFind);
    // console.log(qrCodeImage.target.value);
    try {
      const response = await fetch(`http://localhost:5000/api/scan-qr/${qrCodeImage}`);
      const userData = await response.json();
      setUserProfile(qrCodeImage);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, schoolName }),
      });

      const data = await response.json();
      console.log(data.qrCodeImage.username);
      setQrCodeImage(data.qrCodeImage);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="School Name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
        />
        <button type="submit">Generate QR Code</button>
      </form>
      {qrCodeImage && <img src={qrCodeImage} alt="QR Code" />}
      <button onClick={handleScan}> Scan QR</button>
      {userProfile && (
        <div>
          <h2>{userProfile.username}</h2>
          <p>School: {userProfile.schoolName}</p>
          {/* Other profile details */}
        </div>
      )}
    </div>
  );
};

export default UserForm;
