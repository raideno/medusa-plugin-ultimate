export interface ControlProps<T> {
  value: T;
  defaultValue?: T;
  onValueChange: (value: T) => void;
}
