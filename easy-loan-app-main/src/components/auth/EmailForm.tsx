
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { emailSchema, EmailFormValues } from '@/schemas/authSchemas';

interface EmailFormProps {
  onSubmit: (values: EmailFormValues) => Promise<void>;
  isLoading: boolean;
}

const EmailForm = ({ onSubmit, isLoading }: EmailFormProps) => {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                  <Mail className="ml-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="name@example.com" 
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending OTP..." : "Continue with Email"}
        </Button>
      </form>
    </Form>
  );
};

export default EmailForm;
