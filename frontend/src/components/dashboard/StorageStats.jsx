"use client";

import { useMediaQuery } from "react-responsive";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { formatSize } from "../../utils/formatters"; // ✅ Use your formatter

ChartJS.register(ArcElement, Tooltip, Legend);

const StorageStats = ({ usedStorage, totalStorage }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const percentage = (usedStorage / totalStorage) * 100;
  const storageColor = percentage > 80 ? "#f87171" : "#3b82f6";

  const data = {
    labels: ["Used Storage", "Free Storage"],
    datasets: [
      {
        data: [usedStorage, totalStorage - usedStorage],
        backgroundColor: [storageColor, "rgba(255, 255, 255, 0.2)"],
        hoverBackgroundColor: ["#dc2626", "#374151"],
        borderWidth: 0,
        borderRadius: [50, 0],
      },
    ],
  };

  const options = {
    cutout: "80%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 bg-gray-900 text-white rounded-xl shadow-md w-full max-w-lg mx-auto flex flex-col md:flex-row md:mt-0 mt-18 items-center justify-around"
    >
      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 z-1"
      >
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
          {Math.round(percentage)}%
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className={`flex flex-col items-center md:items-start justify-center text-center md:text-left ${
          isMobile ? "mt-4 w-full" : "ml-6"
        }`}
      >
        <p className="text-xl font-semibold">Storage Usage</p>
        <p className="text-sm text-gray-400">
          {formatSize(usedStorage)} / {formatSize(totalStorage)}
        </p>
        <p
          className={`text-sm font-bold ${
            percentage > 80 ? "text-red-400" : "text-green-400"
          }`}
        >
          {percentage > 80 ? "Almost Full" : "Sufficient Space"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default StorageStats;
