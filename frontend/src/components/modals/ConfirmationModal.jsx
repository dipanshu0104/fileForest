import { AnimatePresence, motion } from 'framer-motion';

const ConfirmationModal = ({ show, onClose, onConfirm, sessionId }) => {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-gray-900 border border-gray-800 p-6 rounded-lg w-[90vw] max-w-md"
            >
              <h2 className="text-lg font-semibold text-white">
                Are you sure you want to terminate this session?
              </h2>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded bg-gray-600 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm(sessionId);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-500"
                >
                  Terminate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  export default ConfirmationModal;