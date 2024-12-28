import { useState } from 'react';
import Papa from 'papaparse';
import { ProcessingStatus, ProcessedEmail } from '../types';
import { isScenario1, processEmailsScenario1, processEmailsScenario2 } from '../utils/csvProcessor';
import { processInChunks } from '../utils/csvChunkProcessor';

interface UseCSVProcessorProps {
  setStatus: (status: ProcessingStatus) => void;
  setProcessedData: (data: ProcessedEmail[] | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const useCSVProcessor = ({
  setStatus,
  setProcessedData,
  setIsProcessing
}: UseCSVProcessorProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setStatus({
      currentTask: 'Reading CSV file',
      progress: 0,
      eta: 0,
      isComplete: false
    });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true, // Skip empty lines for faster processing
      complete: async (results) => {
        const headers = Object.keys(results.data[0]);
        const scenario1 = isScenario1(headers);
        
        try {
          const processed = await processInChunks(
            results.data,
            async (chunk) => scenario1
              ? await processEmailsScenario1(chunk, setStatus)
              : await processEmailsScenario2(chunk, setStatus),
            (progress) => setStatus(prev => ({
              ...prev,
              progress,
              eta: (100 - progress) * 0.5
            }))
          );
          
          setProcessedData(processed);
          setStatus(prev => ({
            ...prev,
            currentTask: 'Processing complete',
            progress: 100,
            isComplete: true
          }));
        } catch (error) {
          console.error('Processing error:', error);
        } finally {
          setIsProcessing(false);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setIsProcessing(false);
      }
    });
  };

  const handleDownload = () => {
    // Prevent multiple downloads
    if (isDownloading) return;
    
    setIsDownloading(true);
    setProcessedData(prevData => {
      if (!prevData) return null;

      try {
        const csv = Papa.unparse(prevData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'processed_emails.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download error:', error);
      } finally {
        setIsDownloading(false);
      }

      return prevData;
    });
  };

  return {
    handleFileSelect,
    handleDownload
  };
};