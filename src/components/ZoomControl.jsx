import { FaMinus, FaPlus } from "react-icons/fa";

export default function ZoomControl({ zoom, setZoom }) {
  return (
    <div className="fixed bottom-4 right-4 bg-white p-3 rounded-xl shadow-md flex items-center space-x-3">
      <button
        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
        onClick={() => setZoom((prev) => Math.max(prev - 10, 10))} // Min 10%
        disabled={zoom <= 10}
      >
        <FaMinus size={16} className={`${zoom <= 10 ? "opacity-50 cursor-not-allowed" : ""}`} />
      </button>

      <input
        type="range"
        min="10"
        max="200"
        step="5"
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="w-28 accent-green-500 cursor-pointer"
      />

      <button
        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
        onClick={() => setZoom((prev) => Math.min(prev + 10, 200))} // Max 200%
        disabled={zoom >= 200}
      >
        <FaPlus size={16} className={`${zoom >= 200 ? "opacity-50 cursor-not-allowed" : ""}`} />
      </button>
    </div>
  );
}
