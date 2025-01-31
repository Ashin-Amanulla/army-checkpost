import { PhotoCamera } from "@mui/icons-material";

const PhotoUpload = ({
  value,
  onChange,
  preview,
  required = false,
  className = "",
}) => {
  return (
    <div
      className={`mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${className}`}
    >
      {preview ? (
        <div className="space-y-2">
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove photo
          </button>
        </div>
      ) : (
        <div className="space-y-1 text-center">
          <PhotoCamera className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
              <span>Upload a photo</span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => onChange(e.target.files[0])}
                required={required && !value}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
