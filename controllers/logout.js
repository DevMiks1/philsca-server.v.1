exports.logout = (req, res) => {
    res.cookie('token', '', {
      httpOnly: true, // Ensure this matches the original cookie attributes
      secure: true, // Use secure cookies if in production
      sameSite: 'Strict', // Use sameSite attribute if it was used originally
      expires: new Date(0), // Set expiry date to the past
      path: '/' // Ensure this matches the path used when setting the cookie
    });
  
    
  
    res.status(200).send('Logout successful');
  };
  