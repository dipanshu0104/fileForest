import { create } from 'zustand';

const useFileStore = create((set) => ({
  files: [],
  totalSize: 0,
  uploadingFiles: [],

  setFiles: (files) => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    set({ files, totalSize });
  },

  addUploadingFile: (file) => set((state) => ({
    uploadingFiles: [...state.uploadingFiles, file]
  })),

  updateUploadingProgress: (filename, progress) => set((state) => ({
    uploadingFiles: state.uploadingFiles.map((f) =>
      f.filename === filename ? { ...f, progress } : f
    )
  })),

  removeUploadingFile: (filename) => set((state) => ({
    uploadingFiles: state.uploadingFiles.filter((f) => f.filename !== filename)
  }))
}));

export default useFileStore;
