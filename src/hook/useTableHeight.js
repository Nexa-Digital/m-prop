import { useState, useEffect } from 'react';

export const useTableHeight = (height = 230) => {
  const [tableHeight, setTableHeight] = useState(
    parseInt(window.innerHeight) - height
  );

  useEffect(() => {
    const handleResize = () => {
      setTableHeight(parseInt(window.innerHeight) - height);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return tableHeight;
};