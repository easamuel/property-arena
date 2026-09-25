import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';

const MAX_FILES = 20;

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  caption: string;
}

interface Props {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

const uploadFile = async (file: File): Promise<string> => {
  if (cloudName && uploadPreset) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'properties');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = (await res.json()) as { secure_url?: string };
    if (!data.secure_url) throw new Error('No URL returned');
    return data.secure_url;
  }
  // Dev / missing config: keep a session blob so the wizard still works locally
  return URL.createObjectURL(file);
};

const PropertyGalleryStep: React.FC<Props> = ({ media, onChange }) => {
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError('');
      setUploading(true);
      try {
        const room = Math.max(0, MAX_FILES - media.length);
        const files = acceptedFiles.slice(0, room);
        const uploads = await Promise.all(
          files.map(async (file) => {
            const url = await uploadFile(file);
            const type = file.type.startsWith('video/') ? 'video' : 'image';
            return { url, type: type as 'image' | 'video', caption: '' };
          }),
        );
        onChange([...media, ...uploads]);
        if (!cloudName || !uploadPreset) {
          setError('Dev mode: images are temporary until VITE_CLOUDINARY_* is set.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [media, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: MAX_FILES,
  });

  const removeAt = (idx: number) => {
    onChange(media.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition ${
          isDragActive ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="mb-2 text-3xl text-brand-green" />
        <p className="text-sm font-semibold text-gray-800">
          {uploading ? 'Uploading…' : 'Drag photos & videos here, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-gray-500">Up to {MAX_FILES} files</p>
      </div>
      {error && <p className="text-xs text-amber-700">{error}</p>}
      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {media.map((item, idx) => (
            <div key={`${item.url}-${idx}`} className="relative overflow-hidden rounded-lg">
              {item.type === 'video' ? (
                <video src={item.url} className="h-28 w-full object-cover" />
              ) : (
                <img src={item.url} alt="" className="h-28 w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute right-1 top-1 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGalleryStep;
