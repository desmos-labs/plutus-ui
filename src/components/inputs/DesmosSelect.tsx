import {ReactComponent as SelectIcon} from "../../assets/icons/arrow-down.svg";
import {
  components,
  ControlProps,
  DropdownIndicatorProps,
  MenuProps,
  OptionProps
} from "react-select";
import Select from 'react-select';

function Control(props: ControlProps<any>) {
  return (
    <components.Control
      {...props}
      className="border-primary-light rounded-md px-1 py-2 pr-2"
    />
  )
}

function IndicatorSeparator() {
  return null;
}

function Menu(props: MenuProps<any>) {
  return <components.Menu {...props} className="drop-shadow-2xl rounded-md"/>
}

function DropdownIndicator(props: DropdownIndicatorProps<any>) {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <SelectIcon/>
      </components.DropdownIndicator>
    )
  );
}


export interface DesmosOption {
  readonly value: string
  readonly label: string
}

interface Props {
  readonly enabled?: boolean;
  readonly value: DesmosOption;
  readonly options: DesmosOption[];
  readonly onChange: (option: DesmosOption) => void;
}

function DesmosSelect({value, options, onChange, enabled}: Props) {
  function Option(props: OptionProps<any>) {
    const border = props.data == options[options.length - 1] ? 'border-none' : 'border-b-[1px]';
    return <components.Option {...props} className={`text-left border-divider ${border}`}/>
  }

  return <Select
    isDisabled={enabled === false}
    isSearchable={false}
    value={value}
    isMulti={false}
    options={options}
    onChange={(v) => onChange(v as DesmosOption)}
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
        borderColor: 'primary-light',
        borderRadius: 'md',
      }),
      menuList: (base) => ({
        ...base,
      })
    }}
  />
}

export default DesmosSelect;