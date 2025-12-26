const fs = require("fs").promises; // async fs
const fsSync = require("fs"); // only for createReadStream
const path = require("path");
const mime = require("mime-types");
const { upload, uploadPath } = require("../utils/upload");

module.exports.getFiles = async (req, res) => {
  const userFolderPath = path.join(uploadPath, req.userId.toString());

  try {
    if (!fsSync.existsSync(userFolderPath)) {
      fsSync.mkdirSync(userFolderPath, { recursive: true });
    }

    const files = await fs.readdir(userFolderPath);

    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(userFolderPath, file);
        const stats = await fs.stat(filePath);

        return {
          filename: file,
          size: stats.size,
          birthtime: stats.birthtime,
          mtime: stats.mtime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory(),
          previewUrl: `${req.protocol}://${req.get(
            "host"
          )}/file/preview/${file}`,
        };
      })
    );

    res.status(200).json(fileDetails);
  } catch (err) {
    console.error("Error reading files:", err);
    res.status(500).json({ error: "Failed to read files" });
  }
};

module.exports.uploadFiles = async (req, res) => {
  const io = req.app.get("io"); // ✅ Get io instance
  io.emit("file:list:updated");
  res.status(200).json({ msg: "Files uploaded." });
};

module.exports.deleteFile = async (req, res) => {
  try {
    const filePath = path.join(uploadPath, req.userId, req.params.filename);
    await fs.access(filePath);
    await fs.unlink(filePath);
    // chokidar will emit
    res.status(200).json({ msg: "File deleted." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(404).json({ error: "File not found or cannot be deleted" });
  }
};

module.exports.renameFile = async (req, res) => {
  try {
    const { currentName, newName } = req.body;
    console.log(currentName, newName);
    if (!currentName || !newName) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const currentPath = path.join(uploadPath, req.userId, currentName);
    const newPath = path.join(uploadPath, req.userId, newName);

    await fs.access(currentPath);
    await fs.rename(currentPath, newPath);

    // chokidar will detect this as unlink + add
    res.status(200).json({ msg: "File renamed." });
  } catch (err) {
    console.error("Rename error:", err);
    res.status(500).json({ error: "Rename failed" });
  }
};

module.exports.downloadFile = async (req, res) => {
  try {
    const filePath = path.join(uploadPath, req.userId, req.params.filename);
    await fs.access(filePath);
    res.download(filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "File download failed" });
        }
      }
    });
  } catch (err) {
    console.error("Download access error:", err);
    res.status(404).json({ error: "File not found" });
  }
};

exports.previewFile = async (req, res) => {
  try {
    const file = req.params.filename;
    if (!file) return res.status(404).json({ error: "File not specified" });

    const filePath = path.join(__dirname, "..", "uploads", req.userId, file);

    if (!fsSync.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    const stat = fsSync.statSync(filePath);
    let mimeType = mime.lookup(filePath) || "application/octet-stream";
    console.log("Detected MIME:", mimeType);

    if (filePath.endsWith(".mp4") && mimeType !== "video/mp4") {
      mimeType = "video/mp4";
    } else if (filePath.endsWith(".mkv")) {
      mimeType = "video/x-matroska"; // Correct MIME for MKV
    }

    if (mimeType.startsWith("video/")) {
      const range = req.headers.range;

      if (!range) {
        res.writeHead(200, {
          "Content-Type": mimeType,
          "Content-Length": stat.size,
        });
        return fsSync.createReadStream(filePath).pipe(res);
      }

      const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : stat.size - 1;

      if (start >= stat.size) {
        return res.status(416).send("Requested range not satisfiable");
      }

      const chunkSize = end - start + 1;
      const stream = fsSync.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": mimeType,
      });

      return stream.pipe(res);
    }

    const inlineTypes = ["image/", "text/", "application/pdf"];
    if (inlineTypes.some((type) => mimeType.startsWith(type))) {
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Disposition", "inline");
      return fsSync.createReadStream(filePath).pipe(res);
    }

    return res
      .status(415)
      .json({ error: "Preview not supported for this file type" });
  } catch (err) {
    console.error("Preview error:", err);
    res
      .status(500)
      .json({ error: "Failed to preview file", details: err.message });
  }
};
