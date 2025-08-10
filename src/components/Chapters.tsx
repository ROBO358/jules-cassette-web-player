import React from 'react';
import './Chapters.css';

interface Chapter {
  startTime: number;
  title: string;
}

interface ChaptersProps {
  chapters: Chapter[];
  onChapterClick: (time: number) => void;
}

const Chapters: React.FC<ChaptersProps> = ({ chapters, onChapterClick }) => {
  return (
    <div className="chapters-container">
      <h4>Chapters</h4>
      <ol className="chapters-list">
        {chapters.map((chapter, index) => (
          <li key={index}>
            <button onClick={() => onChapterClick(chapter.startTime)}>
              {chapter.title}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Chapters;
