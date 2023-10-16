import { ControlProps } from ".";

type HTMLElementType = HTMLInputElement;

interface StringControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string> {}

const OneToManyRelationSelectControl = ({
  value,
  defaultValue,
  onValueChange,
  ...props
}: StringControlProps) => {
  return <div>OneToManyRelationSelectControl</div>;
};

export default OneToManyRelationSelectControl;
