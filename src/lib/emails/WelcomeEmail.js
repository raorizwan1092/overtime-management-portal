export function welcomeEmailTemplate({ name, email, password }) {
  return `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 20px; font-family: 'Inter', Arial, sans-serif; background: #000000;">
          <div style="max-width: 500px; margin: 0 auto; background: #000000; border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1);">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background: #111111; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.2);">
                <span style="color: #ffffff; font-size: 28px;">✨</span>
              </div>
            </div>
            
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0 0 10px 0; text-align: center; letter-spacing: -0.5px;">
              Welcome, ${name}! 👋
            </h1>
            
            <p style="color: #ffffff; font-size: 16px; text-align: center; margin: 0 0 30px 0; line-height: 1.6; opacity: 0.8;">
              Your account has been created successfully.
            </p>
            
            <div style="background: #111111; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid rgba(255,255,255,0.1);">
              <div style="margin-bottom: 20px;">
                <div style="color: #ffffff; font-size: 14px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6;">Email</div>
                <div style="color: #ffffff; font-size: 16px; font-weight: 500; background: #1a1a1a; padding: 10px 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">${email}</div>
              </div>
              
              <div style="margin-bottom: 15px;">
                <div style="color: #ffffff; font-size: 14px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6;">Password</div>
                <div style="color: #ffffff; font-size: 16px; font-weight: 500; background: #1a1a1a; padding: 10px 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-family: monospace;">${password}</div>
              </div>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.05); border-left: 4px solid #ffffff; padding: 15px; margin: 25px 0; border-radius: 8px;">
              <p style="color: #ffffff; margin: 0; font-size: 14px; font-weight: 500; opacity: 0.9;">
                ⚠️ Security Tip: Please change your password after logging in for the first time.
              </p>
            </div>
            
            <div style="text-align: center; margin: 35px 0 25px 0;">
              <a href="https://portal-of-hr.vercel.app/signin" style="background: #ffffff; color: #000000; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(255,255,255,0.2);">
                Login to Your Account
              </a>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 30px; padding-top: 25px; text-align: center;">
              <p style="color: #ffffff; font-size: 14px; margin: 0; opacity: 0.6;">
                Thanks for joining us!<br>
                <span style="color: #ffffff; font-weight: 500; opacity: 1;">The Team</span>
              </p>
              
              <p style="color: #ffffff; font-size: 12px; margin-top: 20px; opacity: 0.4;">
                © 2024 Your Company. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
}
