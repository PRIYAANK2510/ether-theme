import classNames from "classnames";

export type ClassValue = classNames.Argument;

export function cn(...inputs: ClassValue[]) {
  return classNames(inputs);
}
