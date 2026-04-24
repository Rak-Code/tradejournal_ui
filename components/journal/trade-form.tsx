'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { tradeFormSchema, TradeFormInput } from '@/lib/validations';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './image-upload';
import { X } from 'lucide-react';

interface TradeFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function TradeForm({ onClose, onSuccess, initialData }: TradeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const form = useForm<TradeFormInput>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: initialData || {
      symbol: '',
      side: 'BUY',
      entry_date: new Date(),
      entry_price: 0,
      quantity: 0,
      status: 'OPEN',
      notes: '',
    },
  });

  const onSubmit = async (values: TradeFormInput) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        entry_date: values.entry_date.toISOString().split('T')[0],
        exit_date: values.exit_date ? values.exit_date.toISOString().split('T')[0] : null,
        image_url: uploadedImage,
      };

      if (initialData?.id) {
        await apiClient.updateTrade(initialData.id, payload);
        toast.success('Trade updated successfully');
      } else {
        await apiClient.createTrade(payload);
        toast.success('Trade created successfully');
      }
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to save trade';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{initialData ? 'Edit Trade' : 'New Trade'}</CardTitle>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Symbol */}
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="AAPL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Side */}
                <FormField
                  control={form.control}
                  name="side"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Side</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BUY">Buy</SelectItem>
                          <SelectItem value="SELL">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Entry Date */}
                <FormField
                  control={form.control}
                  name="entry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value.toISOString().split('T')[0]}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Entry Price */}
                <FormField
                  control={form.control}
                  name="entry_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Exit Date (if Closed) */}
                {form.watch('status') === 'CLOSED' && (
                  <FormField
                    control={form.control}
                    name="exit_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exit Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Exit Price (if Closed) */}
                {form.watch('status') === 'CLOSED' && (
                  <FormField
                    control={form.control}
                    name="exit_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exit Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Trade notes and observations..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div>
                <FormLabel className="mb-2 block">Trade Image</FormLabel>
                <ImageUpload
                  onImageUploaded={(url) => setUploadedImage(url)}
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : initialData ? 'Update Trade' : 'Create Trade'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
