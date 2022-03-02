import {ReactComponent as SelectIcon} from "../../assets/icons/arrow-down.svg";
import {
  components,
  ControlProps,
  DropdownIndicatorProps,
  IndicatorSeparatorProps,
  InputProps,
  OptionProps
} from "react-select";
import Select from 'react-select';

function Control(props: ControlProps<any>) {
  return (
    <components.Control className="border-[1px] border-primary-light px-1 py-2 pr-2" {...props} />
  )
}

function Input(props: InputProps<any>) {
  return <components.Input {...props} isDisabled={true}/>;
}

function IndicatorSeparator(props: IndicatorSeparatorProps<any>) {
  return null;
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


export type DesmosOption = {
  value: string
  label: string
}

interface Props {
  value: DesmosOption;
  options: DesmosOption[];
  onChange: (option: DesmosOption) => void;
}

function DesmosSelect({value, options, onChange}: Props) {
  function Option(props: OptionProps<any>) {
    const border = props.data == options[options.length - 1] ? 'border-none' : 'border-b-[1px]';
    return <components.Option {...props} className={`text-left border-divider ${border}`}/>
  }

  return <Select
    value={value}
    isMulti={false}
    options={options}
    onChange={(v) => onChange(v as DesmosOption)}
    components={{
      Control,
      Input,
      Option,
      IndicatorSeparator,
      DropdownIndicator,
    }}
  />
}

export default DesmosSelect;