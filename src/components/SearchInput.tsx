import React, { useCallback } from "react";
import LanguageFilter from "./LanguageFilter";
import { debounce } from "lodash";

export interface SearchInputI {
  onLanguageChange: (language: string) => void;
  onSearchStringChange: (searchString: string) => void;
}

export default function SearchInput(props: SearchInputI) {
  const debouncedOnSearchStringChange = useCallback(
    debounce((value: string) => {
      props.onSearchStringChange(value);
    }, 500),
    [],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnSearchStringChange(e.target.value);
  };

  return (
    <div>
      <div className={"sm:w-full lg:w-1/2 mx-auto"}>
        <input
          className="shadow appearance-none border border-blue-950 rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full py-2 px-3 mb-3 "
          id="filter-input"
          type="text"
          placeholder="filter issues"
          onChange={handleInputChange}
        />
      </div>
      <LanguageFilter onLanguageChange={debouncedOnSearchStringChange} />
    </div>
  );
}
