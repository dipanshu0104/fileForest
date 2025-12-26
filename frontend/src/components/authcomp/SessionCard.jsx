import { motion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Globe,
  Clock,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "../../utils/formatters";

const SessionCard = ({ session, onTerminate }) => {
  const isCurrent = session.isCurrent || false;

  const DeviceIcon =
    session.device?.toLowerCase().includes("mobile") ||
    session.os?.toLowerCase().includes("android") ||
    session.os?.toLowerCase().includes("ios")
      ? Smartphone
      : Monitor;

  return (
    <motion.div
      className={`
  relative
  flex flex-col sm:flex-col
  gap-3 sm:gap-4
  px-3 py-3 sm:p-3
  bg-gray-900
  border
  ${isCurrent ? "border-emerald-500" : "border-gray-800"}
  rounded-xl sm:rounded-2xl
  sm:shadow-md
  transition-all
      `}
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500/10 p-2 sm:p-3 rounded-xl flex-shrink-0">
          <DeviceIcon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm sm:text-lg truncate">
            {session.device || "Unknown Device"}
          </h3>

          <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1 truncate">
            <Cpu size={13} />
            {session.os || "Unknown OS"} •{" "}
            {session.browser || "Unknown Browser"}
          </p>

          <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1 truncate">
            <Globe size={13} /> {session.ipAddress || "N/A"}
          </p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="text-gray-400 flex items-center gap-1">
          <Clock size={13} />
          {session.createdAt ? formatDate(session.createdAt) : "Unknown Time"}
        </div>

        {isCurrent ? (
          <div className="flex items-center px-3 py-1 border-1 border-emerald-400 rounded-full bg-emerald-500/10 gap-1 text-emerald-400 font-medium">
            <ShieldCheck size={14} />
            Current
          </div>
        ) : (
          <button
            onClick={() => onTerminate(session.sessionId)}
            className="text-red-400 px-3 py-1 border-1 border-red-400 rounded-full bg-red-500/10 hover:text-red-300 font-medium transition-colors"
          >
            Terminate
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SessionCard;
