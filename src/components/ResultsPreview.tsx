import React from 'react';
import { ProcessedEmail } from '../types';
import { Download } from 'lucide-react';

interface ResultsPreviewProps {
  data: ProcessedEmail[];
  onDownload: () => void;
}

export const ResultsPreview: React.FC<ResultsPreviewProps> = ({ data, onDownload }) => {
  // Define which columns to show in preview
  const columnsToShow = ['email', 'fullName', 'firstName', 'lastName', 'title', 'cleanedWebsite', 'mxProvider', 'otherDmName'];
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Processing Complete
          </h2>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </button>
        </div>
        <p className="mt-2 text-gray-600">
          Processed {data.length} unique email records
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columnsToShow.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  {columnsToShow.map((column, j) => (
                    <td
                      key={j}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {row[column]?.toString() || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};