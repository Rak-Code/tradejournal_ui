'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
}

export function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        toast.error('Please select an image file');
        return;
      }

      const file = acceptedFiles[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = async () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);

        // Upload to server
        setIsUploading(true);
        try {
          const response = await apiClient.uploadImage(file);
          if (response.data?.image_url) {
            onImageUploaded(response.data.image_url);
            toast.success('Image uploaded successfully');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to upload image';
          toast.error(errorMessage);
          setPreview(null);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    },
    [onImageUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] },
    disabled: isUploading,
  });

  const handleRemove = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-slate-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="h-8 w-8 mx-auto text-slate-400 mb-2" />
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the image here...</p>
          ) : (
            <div>
              <p className="text-slate-900 font-medium">Drag and drop your image here</p>
              <p className="text-slate-600 text-sm">or click to select from your computer</p>
              <p className="text-slate-500 text-xs mt-2">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>
      )}
      {isUploading && (
        <div className="text-center text-sm text-slate-600">
          Uploading image...
        </div>
      )}
    </div>
  );
}
