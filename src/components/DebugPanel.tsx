import { useState, useEffect } from 'react';

export const DebugPanel = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
    setLogs(storedLogs);
  }, []);

  if (!import.meta.env.DEV) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        🐛
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-4 w-96 h-96 bg-white border shadow-xl rounded-lg overflow-hidden z-50">
          <div className="bg-purple-600 text-white p-2 flex justify-between items-center">
            <span className="font-bold">Debug Logs</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="overflow-auto h-full p-2 text-xs">
            {logs.map((log, i) => (
              <div key={i} className="mb-2 border-b pb-2">
                <div className="font-bold">{log.level.toUpperCase()}</div>
                <div>{log.message}</div>
                <div className="text-gray-500">{log.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
