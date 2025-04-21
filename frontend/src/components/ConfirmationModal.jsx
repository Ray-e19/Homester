const ConfirmationModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="confirmation-content bg-gray-800 p-8 rounded-lg max-w-md text-center">
        <h3 className="text-xl font-bold mb-4">{message}</h3>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
