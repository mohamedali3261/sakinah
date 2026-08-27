import React from 'react';
import { QuranImagePageView } from '../QuranImagePageView';

interface QuranStandaloneMushafProps {
  currentPageNumber: number;
  handlePageChange: (newPage: number, direction: number) => void;
  pageDirection: number;
  theme: string;
  language: string;
  onClose: () => void;
}

export const QuranStandaloneMushaf: React.FC<QuranStandaloneMushafProps> = ({
  currentPageNumber,
  handlePageChange,
  pageDirection,
  theme,
  language,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[120] bg-slate-950 flex flex-col justify-between w-screen h-screen overflow-hidden">
      <QuranImagePageView
        pageNumber={currentPageNumber}
        onPageChange={handlePageChange}
        direction={pageDirection}
        theme={theme}
        language={language}
        isStandalone={true}
        onClose={onClose}
      />
    </div>
  );
};
