import React from "react";
import Select, {
  components,
  ControlProps,
  DropdownIndicatorProps,
  MenuProps,
  OptionProps,
} from "react-select";
import { ReactComponent as SelectIcon } from "../../assets/icons/arrow-down.svg";
import { DesmosProfile } from "../../types";
import { getDTag, getProfilePic } from "../utils";

function Control(props: ControlProps<any>) {
  return (
    <components.Control {...props} className="rounded-xl px-1 py-3 pr-2" />
  );
}

function IndicatorSeparator() {
  return null;
}

function Menu({ className, ...props }: MenuProps<any>) {
  return (
    <components.Menu
      {...props}
      className={`${className} drop-shadow-2xl rounded-xl outline-none border-none`}
    />
  );
}

function DropdownIndicator(props: DropdownIndicatorProps<any>) {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <SelectIcon />
      </components.DropdownIndicator>
    )
  );
}

function formatOptionLabel(profile: DesmosProfile) {
  return (
    <div className="flex flex-row">
      <img
        className="w-10 h-10 rounded-full my-auto"
        src={getProfilePic(profile)}
        alt={`${profile.nickname} profile pic`}
      />
      <div className="ml-2 overflow-ellipsis text-ellipsis truncate">
        <p className="font-medium">{getDTag(profile)}</p>
        <p className="text-sm text-light-gray">{profile.address}</p>
      </div>
    </div>
  );
}

interface Props {
  readonly enabled?: boolean;
  readonly value: DesmosProfile;
  readonly options: DesmosProfile[];
  readonly onChange: (option: DesmosProfile) => void;
}

function DesmosSelect({ value, options, onChange, enabled }: Props) {
  const Option = React.memo(({ data, ...props }: OptionProps<any>) => {
    const border =
      data === options[options.length - 1] ? "border-none" : "border-b-[1px]";
    return (
      <components.Option
        {...props}
        data={data}
        className={`text-left border-divider ${border}`}
      />
    );
  });

  return (
    <Select
      isDisabled={enabled === false}
      isSearchable={false}
      value={value}
      isMulti={false}
      options={options}
      formatOptionLabel={formatOptionLabel}
      onChange={(v) => onChange(v as DesmosProfile)}
      components={{
        Control,
        Option,
        IndicatorSeparator,
        Menu,
        DropdownIndicator,
      }}
      styles={{
        control: (base) => ({
          ...base,
          border: "none",
          borderRadius: "xl",
        }),
        menu: (base) => ({
          ...base,
          border: "none",
          outline: "none",
          borderRadius: "xl",
        }),
        option: (base) => ({
          ...base,
          color: "dark-gray",
          backgroundColor: "white",
          ":hover": {
            backgroundColor: "white",
          },
        }),
      }}
    />
  );
}

DesmosSelect.defaultProps = {
  enabled: true,
};

export default DesmosSelect;
