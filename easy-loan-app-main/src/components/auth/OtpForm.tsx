
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { otpSchema, OtpFormValues } from '@/schemas/authSchemas';

interface OtpFormProps {
  onSubmit: (values: OtpFormValues) => Promise<void>;
  onResendOtp: () => Promise<void>;
  onBackToEmail: () => void;
  email: string;
  isLoading: boolean;
}

const OtpForm = ({ 
  onSubmit, 
  onResendOtp, 
  onBackToEmail, 
  email,
  isLoading 
}: OtpFormProps) => {
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <div className="flex justify-center my-4">
                  <InputOTP 
                    maxLength={6}
                    value={value}
                    onChange={onChange}
                    {...fieldProps}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot key={i} id={`otp-${i}`} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify & Login"}
          </Button>
        </form>
      </Form>
      <div className="flex justify-between p-6 pt-0">
        <Button 
          variant="link" 
          onClick={onBackToEmail}
          disabled={isLoading}
        >
          Use a different email
        </Button>
        <Button 
          variant="link" 
          onClick={onResendOtp}
          disabled={isLoading}
        >
          Resend code
        </Button>
      </div>
    </>
  );
};

export default OtpForm;
