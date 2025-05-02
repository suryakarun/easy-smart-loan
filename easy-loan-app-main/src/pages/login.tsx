
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import EmailForm from '@/components/auth/EmailForm';
import OtpForm from '@/components/auth/OtpForm';
import { EmailFormValues, OtpFormValues } from '@/schemas/authSchemas';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  
  const generateOtp = (): string => {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const handleEmailSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    try {
      // Generate a new OTP
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmail(values.email);
      setStep('otp');
      
      // Show the OTP in a toast for demo purposes
      // In a real app, this would be sent via email/SMS
      toast.success(`OTP sent to ${values.email}`, {
        description: `Your verification code is: ${newOtp}`
      });
      
      console.log(`Generated OTP for ${values.email}: ${newOtp}`);
    } catch (error) {
      toast.error("Failed to send OTP", {
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpSubmit = async (values: OtpFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show the OTP in a toast for demo purposes
      toast.success(`New OTP sent to ${email}`, {
        description: `Your new verification code is: ${newOtp}`
      });
      
      console.log(`Resent OTP for ${email}: ${newOtp}`);
    } catch (error) {
      toast.error("Failed to resend OTP", {
        description: "Please try again later"
      });
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
