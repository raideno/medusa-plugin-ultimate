import { isEmpty } from "lodash";
import React, { useRef, useState, ChangeEvent, MouseEvent } from "react";
import { Badge, Button, Input, Text, Tooltip } from "@medusajs/ui";

import { ControlProps } from ".";
import { XMark } from "@medusajs/icons";

type HTMLElementType = HTMLInputElement;

interface StringArrayControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string[]> {}

const StringArrayControl = ({
  value,
  defaultValue,
  onValueChange,
  ...props
}: StringArrayControlProps) => {
  // TODO: reorder this mess, either us the ref or the state

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");

  function handleClick(event: MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    const input = inputRef.current;
    if (!input) return;

    const value = input.value;

    addKeyword(value);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key;

    if (key !== "Enter") return;

    event.preventDefault();

    const input = inputRef.current;

    if (!input) return;

    const value = input.value;

    addKeyword(value);
  }

  function addKeyword(keyword: string) {
    if (isEmpty(keyword)) return;

    const newValue = JSON.parse(JSON.stringify(value)) as typeof value;
    newValue.push(keyword);
    onValueChange(newValue);

    const input = inputRef.current;

    if (!input) return;

    setInputValue("");
    input.value = "";
  }

  function removeKeyword(keywordIndex: number, keyword: string) {
    const newValue = JSON.parse(JSON.stringify(value)) as typeof value;
    newValue.splice(keywordIndex, 1);
    onValueChange(newValue);
  }

  function handleInputValueChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);
  }

  return (
    <div className="h-full border border-dashed rounded p-2 flex flex-col items-center gap-2">
      <div className="w-full gap-2 grid grid-cols[1fr_auto]">
        <Input
          className="w-full"
          size="base"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputValueChange}
          onKeyDown={handleKeyPress}
        />
        {/* TODO: fix any */}
        <Button variant="secondary" onClick={handleClick as any}>
          Add Keyword
        </Button>
      </div>
      <div className="w-full flex flex-row items-center gap-2 flex-row">
        {value.map((keyword, keywordIndex) => {
          return (
            <Tooltip content="Click to delete." key={"keyword-" + keywordIndex}>
              <Badge
                className="cursor-pointer gap1"
                onClick={removeKeyword.bind(null, keywordIndex, keyword)}
              >
                <Text>{keyword}</Text>
                <XMark />
              </Badge>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default StringArrayControl;
