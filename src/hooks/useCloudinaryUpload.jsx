import { useState } from 'react';
import { toast } from 'sonner';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function useCloudinaryUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      const missing = [];
      if (!CLOUD_NAME) missing.push('VITE_CLOUDINARY_CLOUD_NAME');
      if (!UPLOAD_PRESET) missing.push('VITE_CLOUDINARY_UPLOAD_PRESET');
      
      const errorMsg = `Missing Cloudinary configuration: ${missing.join(', ')}`;
      console.error(errorMsg);
      toast.error('Configuration Error', { description: 'Contact admin: Missing Cloudinary keys.' });
      setError(errorMsg);
      return null;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);
      return data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setError(err.message);
      setLoading(false);
      toast.error('Upload Failed', { description: 'Failed to upload image to Cloudinary.' });
      return null;
    }
  };

  return { upload, loading, error };
}
