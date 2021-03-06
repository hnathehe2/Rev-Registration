import * as React from 'react';
import ExpandedCourseCard from './ExpandedCourseCard/ExpandedCourseCard';
import CollapsedCourseCard from './CollapsedCourseCard/CollapsedCourseCard';

interface CourseSelectCardProps {
  id: number;
}

const CourseSelectCard: React.FC<CourseSelectCardProps> = ({ id }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return collapsed ? (
    <CollapsedCourseCard
      onExpand={(): void => { setCollapsed(false); }}
      id={id}
    />
  ) : (
    <ExpandedCourseCard
      onCollapse={(): void => { setCollapsed(true); }}
      id={id}
    />
  );
};

export default CourseSelectCard;
