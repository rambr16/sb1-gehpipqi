export const cleanDomain = (url: string): string => {
  if (!url) return '';
  try {
    // Remove protocol and www
    let domain = url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '');
    
    // Get domain without path and query parameters
    domain = domain.split(/[/?#]/)[0];
    
    // Remove trailing slashes
    domain = domain.replace(/\/+$/, '');
    
    return domain;
  } catch (error) {
    return url;
  }
};

export const getMxProvider = async (domain: string): Promise<string> => {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=mx`);
    const data = await response.json();
    const mxRecord = data.Answer?.[0]?.data.toLowerCase() || '';
    
    if (mxRecord.includes('google') || mxRecord.includes('gmail')) {
      return 'google';
    } else if (mxRecord.includes('outlook') || mxRecord.includes('microsoft')) {
      return 'outlook';
    }
    return 'others';
  } catch (error) {
    return 'unknown';
  }
};