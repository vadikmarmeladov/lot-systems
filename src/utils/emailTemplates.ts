export const verificationEmailTemplate = (code: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { 
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #4A5568;
      padding: 10px;
      background: #EDF2F7;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to LOT</h2>
    <p>Your verification code is:</p>
    <div class="code">${code}</div>
    <p>This code will expire in 5 minutes.</p>
  </div>
</body>
</html>
`;
