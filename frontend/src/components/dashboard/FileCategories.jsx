import { FaFileAlt, FaImage, FaMusic, FaFolderOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔑 Import for navigation
import api from '../../utils/api';
import socket from '../../utils/socket';
import { formatDate, formatSize } from '../../utils/formatters';

const extensions = {
  documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'],
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  media: ['mp4', 'mkv', 'mp3', 'wav', 'flac', 'mov'],
};

const categorizeFiles = (files) => {
  const categories = {
    Documents: [],
    Images: [],
    'Video, Audio': [],
    Others: [],
  };

  for (const file of files) {
    const ext = file.filename.split('.').pop()?.toLowerCase();
    if (extensions.documents.includes(ext)) categories.Documents.push(file);
    else if (extensions.images.includes(ext)) categories.Images.push(file);
    else if (extensions.media.includes(ext)) categories['Video, Audio'].push(file);
    else categories.Others.push(file);
  }

  const mapToCategory = (name, icon, color) => {
    const items = categories[name];
    const size = items.reduce((acc, file) => acc + file.size, 0);
    const latest = items.sort((a, b) => new Date(b.mtime) - new Date(a.mtime))[0]?.mtime;

    return {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), // For URL param
      icon: icon({ className: `${color} text-2xl` }),
      size: formatSize(size),
      lastUpdate: latest ? formatDate(latest) : 'N/A',
    };
  };

  return [
    mapToCategory('Documents', FaFileAlt, 'text-red-400'),
    mapToCategory('Images', FaImage, 'text-blue-400'),
    mapToCategory('Video, Audio', FaMusic, 'text-green-400'),
    mapToCategory('Others', FaFolderOpen, 'text-yellow-400'),
  ];
};

const FileCategories = () => {
  const [categories, setCategories] = useState([]);
  const [connected, setConnected] = useState(true);
  const navigate = useNavigate(); // 🔑 Navigation hook

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files');
      const categorized = categorizeFiles(res.data);
      setCategories(categorized);
      setConnected(true);
    } catch (err) {
      console.error('Error fetching files:', err);
      setConnected(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    socket.on('file:list:updated', fetchFiles);
    return () => socket.off('file:list:updated', fetchFiles);
  }, []);

  const handleCategoryClick = (slug) => {
    navigate(`/${slug}`); // 🔁 Navigate to files/documents or files/images etc.
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 bg-gray-950 rounded-xl shadow-lg min-h-[150px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {connected ? (
        categories.map((category, index) => (
          <motion.div
            key={index}
            onClick={() => handleCategoryClick(category.slug)}
            className="flex items-center p-6 bg-gray-900 rounded-xl shadow-md cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-3 bg-gray-800 rounded-lg">{category.icon}</div>
            <div className="ml-4 text-white">
              <h3 className="text-lg font-semibold">{category.size}</h3>
              <p className="text-sm text-gray-400">{category.name}</p>
              <p className="text-xs text-gray-500">Last update: {category.lastUpdate}</p>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="col-span-full flex justify-center items-center p-6 bg-gray-900 rounded-xl text-white">
          <div className="text-center">
            <p className="text-red-400 font-semibold text-lg">Backend not connected</p>
            <p className="text-gray-400 text-sm">Make sure your server is running.</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FileCategories;
