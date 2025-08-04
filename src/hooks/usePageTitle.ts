import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const baseTitle = 'Rotary Cochin Lakeside';
    document.title = title ? `${title} - ${baseTitle}` : baseTitle;
    
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
}; 