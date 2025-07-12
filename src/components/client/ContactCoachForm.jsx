import React from 'react';
import { useForm } from 'react-hook-form';
import { Message } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

export default function ContactCoachForm({ client }) {
  const { register, handleSubmit, reset, formState: { isSubmitting, isSubmitSuccessful } } = useForm();

  const onSubmit = async (data) => {
    try {
      await Message.create({
        ...data,
        client_email: client.email,
        coach_email: client.coach_email,
        sender_type: 'client',
        is_read: false,
        priority: 'normal'
      });
      reset();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Card className="bg-white border-gray-200 h-full">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Contact Your Coach</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="subject" className="text-gray-700">Subject</Label>
            <Input id="subject" {...register('subject', { required: true })} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="content" className="text-gray-700">Message</Label>
            <Textarea id="content" {...register('content', { required: true })} rows={5} className="mt-1" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
          {isSubmitSuccessful && <p className="text-sm text-center text-green-600 mt-2">Message sent successfully!</p>}
        </form>
      </CardContent>
    </Card>
  );
}