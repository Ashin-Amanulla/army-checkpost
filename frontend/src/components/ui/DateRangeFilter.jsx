import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

function DateRangeFilter({ startDate, endDate, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          type="date"
          value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
          onChange={(e) => onChange('startDate', new Date(e.target.value))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>
        <input
          type="date"
          value={endDate ? new Date(endDate).toISOString().split('T')[0] : ''}
          onChange={(e) => onChange('endDate', new Date(e.target.value))}
          min={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
    </div>
  );
}

export default DateRangeFilter; 