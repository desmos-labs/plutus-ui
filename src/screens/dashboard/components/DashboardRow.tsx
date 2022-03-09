import React from "react";

interface DashboardRowProps {
  readonly icon: string;
  readonly title: string;
  readonly text: string;
  readonly button: React.ReactNode;
}

/**
 * Represents a generic integration item.
 * @constructor
 */
function DashboardRow({ icon, title, text, button }: DashboardRowProps) {
  return (
    <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row">
      <div className="mx-2">
        <img className="w-12 h-12" src={icon} alt={`${title} logo`} />
      </div>
      <div className="flex-grow mx-2 mt-2 md:my-auto">
        <p className="font-bold">{title}</p>
        <p className="text-sm">{text}</p>
      </div>
      <div className="min-w-max text-center text-sm mt-2 md:my-auto">
        {button}
      </div>
    </div>
  );
}

export default DashboardRow;
