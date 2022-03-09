import React from "react";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchChange: (search: string) => void;
}

/**
 * Represents a search bar.
 * @constructor
 */
function SearchBar({ onSearchChange, className, ...props }: SearchProps) {
  const style = `px-3 py-2 flex flex-row bg-white rounded-xl shadow-[0px_16px_30px_10px_rgba(70,53,43,0.02)] ${className}`;
  return (
    <div className={style}>
      <SearchIcon className="my-auto ml-1 mx-2" />
      <input
        {...props}
        className="border-none outline-none px-0 py-2 w-full"
        type="text"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
