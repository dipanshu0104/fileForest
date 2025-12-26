import { create } from 'zustand';

export const useFileStore = create((set, get) => ({
  files: [],
  totalSize: 0,
  recentFiles: [],

  setFiles: (files) => {
    const sortedFiles = [...files].sort((a, b) => new Date(b.birthtime) - new Date(a.birthtime));
    set({
      files,
      totalSize: files.reduce((acc, f) => acc + f.size, 0),
      recentFiles: sortedFiles.slice(0, 10),
    });
  },

  addFile: (file) => {
    const currentFiles = [...get().files, file];
    get().setFiles(currentFiles);
  },

  deleteFile: (filename) => {
    const updatedFiles = get().files.filter(f => f.filename !== filename);
    get().setFiles(updatedFiles);
  },

  renameFile: (oldName, newName) => {
    const updatedFiles = get().files.map(f =>
      f.filename === oldName ? { ...f, filename: newName } : f
    );
    get().setFiles(updatedFiles);
  },

  updateFileList: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files`);
      const data = await response.json();
      get().setFiles(data);
    } catch (err) {
      console.error('Failed to update file list:', err);
    }
  }
}));