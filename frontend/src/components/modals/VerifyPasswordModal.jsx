import { AnimatePresence, motion } from "framer-motion";

export default function VerifyPasswordModal({
  open,
  currentPassword,
  setCurrentPassword,
  error,
  isLoading,
  onCancel,
  onConfirm,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="bg-gray-900 p-6 rounded-xl shadow-xl w-[90vw] max-w-md text-white"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-semibold mb-4">Verify Your Password</h3>

            <input
              type="password"
              autoFocus
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="
                w-full p-3
                bg-gray-800
                rounded-md
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-700 cursor-pointer hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-500 rounded-md disabled:opacity-60"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
