import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import SessionCard from "../components/authcomp/SessionCard";

const SessionsPage = () => {
  const { allSessions, getSessions, terminateSession } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    getSessions(); // Initial fetch
    const interval = setInterval(() => {
      getSessions(); // Poll every 1 second
    }, 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [getSessions]);

  const handleTerminateClick = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };

  const handleConfirmTerminate = async (sessionId) => {
    await terminateSession(sessionId);
  };

  return (
    <div className="max-w-full mx-auto max-h-full h-full md:mt-0 mt-15 rounded-2xl bg-gray-950 px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl text-white sm:text-3xl font-bold mb-6">
        Active Sessions
      </h1>

      {allSessions.length === 0 ? (
        <div className="text-gray-500">No active sessions.</div>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence>
            {allSessions.map((session) => (
              <motion.li
                key={session.sessionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <SessionCard
                  session={session}
                  onTerminate={handleTerminateClick}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmTerminate}
        sessionId={selectedSessionId}
      />
    </div>
  );
};

export default SessionsPage;
