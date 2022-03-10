import React from "react";

interface BaseContentProps {
  readonly icon?: React.ReactNode;
  readonly title: string;
  readonly children: JSX.Element;
}

function BaseContent({ icon, title, children }: BaseContentProps) {
  return (
    <div>
      {icon && <div className="mb-4">{icon}</div>}
      <p className="text-lg font-bold mb-4">{title}</p>
      {children}
    </div>
  );
}

BaseContent.defaultProps = {
  icon: null,
};

export default BaseContent;
