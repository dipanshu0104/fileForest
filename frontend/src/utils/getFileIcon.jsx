import fileIconsMap from "./fileIconsMap";

export const getFileIconPath = (fileName) => {
  if (!fileName) return "/icons/default.png";
  const ext = fileName.split(".").pop().toLowerCase();
  const iconFile = fileIconsMap[ext] || fileIconsMap["default"];
  return `/icons/${iconFile}`;
};

export const getFileFormat = (filename) => {
  if (!filename) return "Unknown";
  const ext = filename.split(".").pop();
  return ext ? ext.toUpperCase() : "Unknown";
};
