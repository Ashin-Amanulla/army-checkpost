import { FilterList } from "@mui/icons-material";
import { Button } from "./";

const FilterBar = ({ 
  showFilters, 
  onToggleFilters, 
  onApplyFilters, 
  onClearFilters,
  children 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleFilters}
            className={showFilters ? 'bg-green-50 text-green-600' : ''}
          >
            <FilterList className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <>
            <div className="space-y-4">
              {children}
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onClearFilters}
              >
                Clear
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={onApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterBar; 