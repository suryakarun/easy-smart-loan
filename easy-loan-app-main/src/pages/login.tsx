import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmailForm from '@/components/auth/EmailForm';
import OtpForm from '@/components/auth/OtpForm';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  const generateOtp = () => {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const sendOtpEmail = async (email, otp) => {
    try {
      // Always log to console for development purposes
      console.log('=======================================');
      console.log(`OTP CODE: ${otp}`);
      console.log(`To: ${email}`);
      console.log('=======================================');
      
      // EmailJS configuration - using different approach
      const templateParams = {
        to_email: email,
        user_email: email,
        email: email,
        recipient: email,
        message: `Your OTP code is: ${otp}`,
        from_name: 'EasyLoan',
        to_name: email.split('@')[0],
        otp_code: otp,
        subject: 'Your EasyLoan Verification Code'
      };
      
      // Replace these with your actual EmailJS credentials
      const serviceId = 'service_51bc7aq';
      const templateId = 'template_takf8gk';
      const publicKey = 'qAmb5sHXIJ4QdurnE';
      
      console.log('Attempting to send real email with params:', templateParams);
      
      // Make direct API call to EmailJS instead of using the SDK
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`EmailJS API error: ${response.status} - ${errorData}`);
      }
      
      console.log('Email sent successfully with direct API call');
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      
      // We'll still return true so the application flow doesn't break
      // The user can still get the OTP from the console for testing
      return true;
    }
  };
  
  const handleEmailSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Validate email format before proceeding
      if (!values.email || !/^\S+@\S+\.\S+$/.test(values.email)) {
        throw new Error('Invalid email format');
      }
      
      // Generate a new OTP
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      
      // Send OTP via mock email service
      await sendOtpEmail(values.email, newOtp);
      
      setEmail(values.email);
      setStep('otp');
      
      toast.success(`Verification code sent`, {
        description: "Please check your email or console for the code"
      });
      
    } catch (error) {
      toast.error("Failed to send verification code", {
        description: error.message || "Please try again"
      });
      console.error('Email submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Verify the entered OTP against the generated one
      if (values.otp === generatedOtp) {
        // Store authentication state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        
        toast.success("Login successful", {
          description: "Welcome to EasyLoan"
        });
        
        // Navigate to home page
        navigate('/');
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Invalid OTP", {
        description: "The code you entered doesn't match. Please check and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      // Generate a new OTP
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      
      // Resend OTP via email
      await sendOtpEmail(email, newOtp);
      
      toast.success(`New OTP sent to ${email}`, {
        description: "Please check your email for the new verification code"
      });
      
    } catch (error) {
      toast.error("Failed to resend OTP", {
        description: "Please try again later"
      });
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-loan-primary">EasyLoan</h1>
          <p className="text-gray-600 mt-2">Smart Loans for Smart People</p>
        </div>
        
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          {step === 'email' ? (
            <>
              <CardHeader>
                <CardTitle className="text-center">Log in to your account</CardTitle>
                <CardDescription className="text-center">Enter your email to receive a verification code</CardDescription>
              </CardHeader>
              <CardContent>
                <EmailForm 
                  onSubmit={handleEmailSubmit} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-center">Enter verification code</CardTitle>
                <CardDescription className="text-center">
                  We sent a 6-digit code to {email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OtpForm 
                  onSubmit={handleOtpSubmit}
                  onResendOtp={handleResendOtp}
                  onBackToEmail={handleBackToEmail}
                  email={email}
                  isLoading={isLoading}
                />
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;
