import { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FaCamera } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import getCroppedImg from "../../utils/cropImageUtils";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

export default function UserAvatarUpload() {
  const fileInputRef = useRef(null);
  const { user, updateAvatar } = useAuthStore();

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 📸 Select Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // ✂ Crop Complete
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // 💾 Save Avatar
  const saveAvatar = useCallback(async () => {
    try {
      setUploading(true);

      // 🔥 Get REAL BLOB from canvas
      const blob = await getCroppedImg(image, croppedAreaPixels);

      // 🔥 Convert Blob → File
      const file = new File([blob], "avatar.png", {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("avatar", file); // MUST MATCH multer field

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}api/upload-avatar`,
        formData,
        {
          withCredentials: true,
        }
      );

      updateAvatar(res.data.avatarUrl);
      setCropModalOpen(false);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  }, [image, croppedAreaPixels, updateAvatar]);

  return (
    <div className="relative w-32 h-32">
      {/* Avatar */}
      <div className="w-full h-full rounded-full overflow-hidden ">
        <img
          src={
            user?.avatar
              ? `${import.meta.env.VITE_API_BASE}${user.avatar}`
              : `${import.meta.env.VITE_API_URL}/uploads/default-avatar.png`
          }
          className="w-full h-full object-cover"
          alt="avatar"
        />
      </div>

      {/* Camera Button */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="absolute bottom-1 right-1 w-8 h-8 bg-[#5b75f9] rounded-full flex items-center justify-center shadow-md hover:bg-[#3d56f0]"
      >
        <FaCamera className="text-white text-sm" />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Crop Modal */}
      <AnimatePresence>
        {cropModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-gray-800 border border-gray-700 rounded-md w-[90vw] max-w-md h-[80vh] p-4 flex flex-col">
              <div className="relative flex-1">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="flex-1"
                />

                <button
                  onClick={saveAvatar}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 rounded text-white"
                >
                  {uploading ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => setCropModalOpen(false)}
                  className="px-4 py-2 bg-red-500 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
