import React from "react";
import {ReactComponent as SearchIcon} from "../assets/icons/cross.svg";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchChange: (search: string) => void;
}

/**
 * Represents a search bar.
 * @constructor
 */
function SearchBar({onSearchChange, className, ...props}: SearchProps) {
  const style = `px-3 py-1 flex flex-row bg-white rounded-full border-primary-light border-[1px] ${className}`;
  return (
    <div
      className={style}>
      <SearchIcon className="my-auto ml-1 mx-2"/>
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