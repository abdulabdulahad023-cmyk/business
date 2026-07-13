import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-screen w-full bg-background items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card border border-border shadow-xl rounded-2xl overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <Link href="/" className="inline-block mb-8">
            <span className="font-display font-bold text-2xl tracking-tighter text-foreground">
              MarketSphere<span className="text-primary">.</span>
            </span>
          </Link>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display font-bold text-3xl mb-3">Forgot Password</h1>
                <p className="text-muted-foreground mb-8">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" className="h-12 bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-bold" 
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <MailCheck className="w-10 h-10" />
                </div>
                <h2 className="font-display font-bold text-2xl mb-3">Check your email</h2>
                <p className="text-muted-foreground mb-8">
                  We've sent a password reset link to <br/>
                  <span className="font-medium text-foreground">{form.getValues('email')}</span>
                </p>
                <div className="p-4 bg-secondary/50 rounded-xl mb-8 text-sm text-left">
                  <p className="font-medium mb-1">Demo Tip:</p>
                  <p className="text-muted-foreground mb-2">Since this is a mockup, you can just click the button below to proceed to the reset page.</p>
                  <Button variant="outline" className="w-full" onClick={() => setLocation('/reset-password?token=mock_token')}>
                    Simulate Email Link Click
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-secondary/30 p-6 border-t border-border flex justify-center">
          <Link href="/login" className="flex items-center text-sm font-semibold text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
