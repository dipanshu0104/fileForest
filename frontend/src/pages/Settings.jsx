import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserAvatarUpload from "../components/usersection/UserAvatarUpload";
import VerifyPasswordModal from "../components/modals/VerifyPasswordModal";
import { useAuthStore } from "../store/authStore";

export default function Settings() {
  const { user, isLoading, updateProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    updatedAt: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const passwordsFilled =
    formData.password.length > 0 && formData.confirmPassword.length > 0;

  const passwordsMatch =
    passwordsFilled && formData.password === formData.confirmPassword;

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        updatedAt: user.updatedAt || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "password" || name === "confirmPassword") {
        setPasswordError(
          updated.password &&
            updated.confirmPassword &&
            updated.password !== updated.confirmPassword
            ? "Passwords do not match"
            : ""
        );
      }

      return updated;
    });
  };

  const handleUpdate = async () => {
    if (!currentPassword) {
      setVerifyError("Current password is required");
      return;
    }

    if (passwordError) return;

    try {
      setVerifyError("");
      setUpdateStatus(null);

      await updateProfile({
        username: formData.fullName,
        newPassword: formData.password || undefined,
        currentPassword,
      });

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        updatedAt: new Date().toISOString(),
      }));

      setCurrentPassword("");
      setShowVerifyModal(false);
      setUpdateStatus("Profile updated successfully");
    } catch (err) {
      setVerifyError(err.message || "Profile update failed");
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen p-4 sm:p-6 md:p-10 text-white bg-gray-950 rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 mt-19 md:mt-0">
        Account Settings
      </h2>

      <div className="flex items-center mb-8">
        <UserAvatarUpload />
        <div className="ml-4 text-lg">{formData.fullName}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-md outline-none"
          />
        </div>

        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full p-3 bg-gray-700 rounded-md opacity-70 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2">New Password</label>

          <div className="flex gap-4">
            <div className="relative w-1/2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full p-3 rounded-md pr-10 bg-gray-800 border border-transparent text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative w-1/2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full p-3 rounded-md pr-10 transition-all outline-none
                  ${
                    passwordsFilled
                      ? passwordsMatch
                        ? "bg-green-900/40 border border-green-500 text-green-200 focus:ring-2 focus:ring-green-500"
                        : "bg-red-900/40 border border-red-500 text-red-200 focus:ring-2 focus:ring-red-500"
                      : "bg-gray-800 border border-transparent text-white"
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={() => setShowVerifyModal(true)}
          disabled={isLoading || passwordError}
          className="px-5 py-2 bg-gray-700 rounded-md disabled:opacity-50"
        >
          Update
        </button>
      </div>

      {updateStatus && (
        <p className="mt-4 text-green-500 text-sm">{updateStatus}</p>
      )}

      <VerifyPasswordModal
        open={showVerifyModal}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        error={verifyError}
        isLoading={isLoading}
        onCancel={() => {
          setShowVerifyModal(false);
          setCurrentPassword("");
          setVerifyError("");
        }}
        onConfirm={handleUpdate}
      />
    </motion.div>
  );
}
