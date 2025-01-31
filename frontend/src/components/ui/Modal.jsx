const Modal = ({ open, onClose, title, children, maxWidth = "md" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-${maxWidth} max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 space-y-6">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 