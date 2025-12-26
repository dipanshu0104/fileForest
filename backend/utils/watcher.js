// backend/utils/watcher.js
const chokidar = require('chokidar');
const path = require('path');

function initializeWatcher(io, watchPath) {
  const watcher = chokidar.watch(watchPath, {
    ignoreInitial: true,
    persistent: true,
    depth: 2,
  });

  watcher
    .on('add', (filePath) => {
      const filename = path.basename(filePath);
      console.log(`🟢 File added: ${filename}`);
      io.emit('file:added', { filename });
      io.emit('file:list:updated');
    })
    .on('unlink', (filePath) => {
      const filename = path.basename(filePath);
      console.log(`🔴 File deleted: ${filename}`);
      io.emit('file:deleted', { filename });
      io.emit('file:list:updated');
    })
    .on('change', (filePath) => {
      const filename = path.basename(filePath);
      console.log(`🟡 File changed: ${filename}`);
      io.emit('file:changed', { filename });
    })
    .on('error', (error) => {
      console.error('Watcher error:', error);
    });

  console.log(`📁 Watching for file changes in ${watchPath}`);
}

module.exports = initializeWatcher;
