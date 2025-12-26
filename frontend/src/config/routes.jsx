import { FaTachometerAlt, FaFolder, FaImage, FaVideo, FaEllipsisH } from "react-icons/fa";
import { MdSpaceDashboard, MdAccountTree } from "react-icons/md";
import { FaArrowLeftLong, FaFileMedical } from "react-icons/fa6";
import { FaUser, FaHistory } from "react-icons/fa";

export const routes = [
  { name: "Dashboard",path: "/", icon: <MdSpaceDashboard className="text-2xl" /> },
  { name: "Documents", path: "/Documents", icon: <FaFolder className="text-xl" /> },
  { name: "Images", path: "/Images", icon: <FaImage className="text-xl" /> },
  { name: "Video, Audio", path: "/Video-Audio", icon: <FaVideo className="text-xl" /> },
  { name: "Others", path: "/Others", icon: <FaEllipsisH className="text-xl" /> },
];

export const userroutes = [
  { name: "Back to Dashboard",path: "/", icon: <FaArrowLeftLong className="text-md" />, color:'bg-red-400' },
  { name: "Account Settings", path: "/user/settings", icon: <FaUser className="text-md" />, color:'bg-green-400' },
  { name: "Sessions", path: "/user/sessions", icon: <MdAccountTree className="text-md" />, color:'bg-orange-400' },
  // { name: "recent Files", path: "/Images", icon: <FaFileMedical className="text-md" />, color:'bg-blue-400' },
  // { name: "History", path: "/Video-Audio", icon: <FaHistory className="text-md" />, color:'bg-indigo-400' },
];


