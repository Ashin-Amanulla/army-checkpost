const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-green-50 rounded-full">
            <Icon className="w-6 h-6 text-green-600" />
          </div>
        )}
      </div>
      {trend && (
        <div className={`mt-4 flex items-center text-sm ${
          trend > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{trend > 0 ? '↑' : '↓'}</span>
          <span className="ml-1">{Math.abs(trend)}% from last period</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard; 