import { ProcessedEmail, ProcessingStatus } from '../types';
import { cleanDomain, getMxProvider } from './domainUtils';
import { assignOtherDmNames } from './emailEnrichment';
import { normalizeContactData } from './dataNormalization';
import { removeDuplicateEmails } from './emailUtils';
import { normalizeEmail } from './emailNormalizer';
import { isScenario1 } from './csvValidator';

export const processEmailsScenario1 = async (
  data: any[],
  updateStatus: (status: ProcessingStatus) => void
): Promise<ProcessedEmail[]> => {
  const processedEmails: ProcessedEmail[] = [];
  const totalRows = data.length * 3;
  let processedRows = 0;

  for (const row of data) {
    for (let i = 1; i <= 3; i++) {
      const email = row[`email_${i}`];
      if (email?.trim()) {
        const normalizedEmail = normalizeEmail(email);
        const domain = normalizedEmail.split('@')[1];
        const mxProvider = await getMxProvider(domain);
        const cleanedWebsite = cleanDomain(row.website || '');
        
        processedEmails.push({
          email: normalizedEmail,
          fullName: row[`email_${i}_full_name`]?.trim(),
          firstName: row[`email_${i}_first_name`]?.trim(),
          lastName: row[`email_${i}_last_name`]?.trim(),
          title: row[`email_${i}_title`]?.trim(),
          phone: row[`email_${i}_phone`]?.trim(),
          website: cleanedWebsite,
          cleanedWebsite,
          mxProvider,
          otherDmName: ''
        });
      }
      processedRows++;
      updateStatus({
        currentTask: 'Processing emails',
        progress: (processedRows / totalRows) * 100,
        eta: (totalRows - processedRows) * 0.5,
        isComplete: false
      });
    }
  }

  // First remove duplicates, then assign other DM names
  const uniqueEmails = removeDuplicateEmails(processedEmails);
  return assignOtherDmNames(uniqueEmails);
};

export const processEmailsScenario2 = async (
  data: any[],
  updateStatus: (status: ProcessingStatus) => void
): Promise<ProcessedEmail[]> => {
  const processedEmails: ProcessedEmail[] = [];
  const totalRows = data.length;
  let processedRows = 0;

  for (const row of data) {
    const email = row.email;
    if (email?.trim()) {
      const normalizedEmail = normalizeEmail(email);
      const domain = normalizedEmail.split('@')[1];
      const mxProvider = await getMxProvider(domain);
      const normalizedData = normalizeContactData(row);
      const cleanedWebsite = cleanDomain(row.website || '');
      
      processedEmails.push({
        email: normalizedEmail,
        ...normalizedData,
        website: cleanedWebsite,
        cleanedWebsite,
        mxProvider,
        otherDmName: ''
      });
    }
    processedRows++;
    updateStatus({
      currentTask: 'Processing emails',
      progress: (processedRows / totalRows) * 100,
      eta: (totalRows - processedRows) * 0.5,
      isComplete: false
    });
  }

  // First remove duplicates, then assign other DM names
  const uniqueEmails = removeDuplicateEmails(processedEmails);
  return assignOtherDmNames(uniqueEmails);
};

export { isScenario1 };