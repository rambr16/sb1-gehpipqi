import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ProgressBar } from './ProgressBar';
import { Header } from './Header';
import { ResultsPreview } from './ResultsPreview';
import { ProcessingStatus, ProcessedEmail } from '../types';
import { useCSVProcessor } from '../hooks/useCSVProcessor';

export const CSVProcessor: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>({
    currentTask: '',
    progress: 0,
    eta: 0,
    isComplete: false
  });
  const [processedData, setProcessedData] = useState<ProcessedEmail[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { handleFileSelect, handleDownload } = useCSVProcessor({
    setStatus,
    setProcessedData,
    setIsProcessing
  });

  const handleRefresh = () => {
    setProcessedData(null);
    setIsProcessing(false);
    setStatus({
      currentTask: '',
      progress: 0,
      eta: 0,
      isComplete: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Header onRefresh={handleRefresh} />

        {!isProcessing && !processedData && (
          <FileUpload onFileSelect={handleFileSelect} />
        )}

        {isProcessing && (
          <div className="bg-white p-6 rounded-lg shadow">
            <ProgressBar status={status} />
          </div>
        )}

        {processedData && !isProcessing && (
          <ResultsPreview 
            data={processedData} 
            onDownload={handleDownload} 
          />
        )}
      </div>
    </div>
  );
};