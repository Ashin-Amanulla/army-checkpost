const Tabs = ({ 
  tabs, 
  activeTab, 
  onChange,
  className = "" 
}) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === tab.value
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            {tab.icon && <tab.icon className="w-5 h-5 mr-2" />}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs; 