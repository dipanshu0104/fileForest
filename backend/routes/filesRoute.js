const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');
const {
  getFiles,
  uploadFiles,
  deleteFile,
  renameFile,
  downloadFile,
  previewFile } = require('../controllers/filecontrolers')

const { upload, uploadPath } = require('../utils/upload');
const { verifyToken } = require("../middleware/verifyToken")


  const router = express.Router();

  // --- Existing API endpoints ---

  // GET /files
  router.get('/files', verifyToken ,getFiles);

  // POST /upload
  router.post('/upload', verifyToken ,upload.array('files'), uploadFiles);


  // DELETE /file/:filename
  router.delete('/file/:filename', verifyToken , deleteFile);

  // POST /rename
  router.put('/rename', verifyToken, renameFile);

  // GET /download/:filename
  router.get('/download/:filename', verifyToken, downloadFile);

  // GET /preview/:filename
  router.get("/preview/:filename", verifyToken ,previewFile);

  

  module.exports = router;

