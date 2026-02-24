import { useRef, useState } from 'react';
import { X, Camera, Trash2, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProfileModal.css';

// Compress image to JPEG, max 800x800, quality 0.82
// This converts ANY format (PNG, WebP, HEIC-via-browser) to a small JPEG
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const MAX = 800;
      let { width, height } = img;

      // Scale down if larger than MAX
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      // White background (handles transparent PNGs)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG at 82% quality — typically ~80-200KB
      const compressed = canvas.toDataURL('image/jpeg', 0.82);
      resolve(compressed);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export default function ProfileModal({ onClose }) {
  const { user, updateAvatar, removeAvatar } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [fileInfo, setFileInfo] = useState(null); // { name, originalKB, compressedKB }

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Please pick an image under 10MB.');
      return;
    }

    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setPreview(compressed);

      // Show compression info
      const originalKB = Math.round(file.size / 1024);
      const compressedKB = Math.round((compressed.length * 3) / 4 / 1024);
      setFileInfo({ name: file.name, originalKB, compressedKB });
    } catch {
      toast.error('Could not process image. Try a different file.');
    } finally {
      setCompressing(false);
    }
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleSave = async () => {
    if (!preview || preview === user?.avatar) { onClose(); return; }
    setLoading(true);
    try {
      await updateAvatar(preview);
      toast.success('Profile picture updated! 🎉');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeAvatar();
      toast.success('Profile picture removed');
      onClose();
    } catch {
      toast.error('Failed to remove picture');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scale" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2>Profile Picture</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Avatar drop zone */}
        <div className="profile-avatar-section">
          <div
            className={`profile-drop-zone ${dragOver ? 'drag-over' : ''} ${compressing ? 'compressing' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !compressing && fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Profile" className="profile-preview-img" />
            ) : (
              <div className="profile-initials-large">{initials}</div>
            )}
            <div className="profile-drop-overlay">
              {compressing
                ? <><span className="spinner" style={{ borderTopColor: 'white' }} /><span>Compressing…</span></>
                : <><Camera size={22} /><span>{preview ? 'Change photo' : 'Upload photo'}</span></>
              }
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* Compression info badge */}
          {fileInfo && !compressing && (
            <div className="compress-info animate-fade">
              <CheckCircle size={13} style={{ color: 'var(--green)' }} />
              <span>
                Compressed from <b>{fileInfo.originalKB}KB</b> → <b>{fileInfo.compressedKB}KB</b> ✓
              </span>
            </div>
          )}

          {!fileInfo && (
            <p className="profile-hint">Click or drag & drop · Any image · Auto-compressed</p>
          )}
        </div>

        {/* User info */}
        <div className="profile-info">
          <div className="profile-name">{user?.name}</div>
          <div className="profile-email">{user?.email}</div>
        </div>

        {/* Action buttons */}
        <div className="profile-actions">
          <button className="btn btn-secondary" style={{ flex: 1 }}
            onClick={() => fileRef.current?.click()} disabled={compressing}>
            <Upload size={15} /> Choose file
          </button>
          {(preview || user?.avatar) && (
            <button className="btn btn-ghost" style={{ color: 'var(--danger)' }}
              onClick={handleRemove} disabled={loading || compressing}>
              <Trash2 size={15} />
            </button>
          )}
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 12, padding: 13 }}
          onClick={handleSave}
          disabled={loading || compressing || preview === user?.avatar}
        >
          {loading ? <span className="spinner" /> : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
