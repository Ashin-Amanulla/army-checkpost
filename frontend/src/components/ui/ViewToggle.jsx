import { GridView, ViewList } from "@mui/icons-material";

const ViewToggle = ({ view, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(view === 'grid' ? 'list' : 'grid')}
      className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
      title={view === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
    >
      {view === 'grid' ? <ViewList className="w-5 h-5" /> : <GridView className="w-5 h-5" />}
    </button>
  );
};

export default ViewToggle; 