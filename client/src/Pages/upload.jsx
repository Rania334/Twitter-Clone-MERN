import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [imageIds, setImageIds] = useState([]);

  // Fetch all images on component load
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/upload');
      setImageIds(res.data);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select an image.');

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      fetchImages(); // Refresh image list after upload
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload and View Images</h2>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>
          Upload
        </button>
      </form>

      <hr />

      <div>
        <h3>Gallery</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {imageIds.map((img) => (
            <img
              key={img._id}
              src={`http://localhost:5000/upload/${img._id}`}
              alt="Uploaded"
              style={{ width: '200px', borderRadius: '8px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
