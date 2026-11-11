"use client";

import * as Select from "@radix-ui/react-select";
import type { ReactElement } from "react";
import { Icon } from "@/shared/components/ui/Icon/Icon";
import { cn } from "@/shared/modules/ui/cn";
import {
  decodeSelectOption,
  encodeSelectOption,
  getSelectedOptionValue,
} from "@/shared/modules/ui/selectField.options";
import type { SelectOption } from "@/shared/modules/ui/selectField.types";
import styles from "./SelectField.module.css";

interface Props {
  id: string;
  label: string;
  value: string;
  options: readonly SelectOption[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  describedBy?: string;
  invalid?: boolean;
}

/**
 * Presents a controlled selection with a styled, focus-managed options panel.
 * @param props - Label, options, external selection, callback and field metadata.
 * @returns An accessible trigger and portalled keyboard-operable option list.
 */
export function SelectField({
  id,
  label,
  value,
  options,
  onValueChange,
  disabled,
  placeholder = "Choose an option",
  className,
  describedBy,
  invalid,
}: Props): ReactElement {
  let selectedLabel = placeholder;
  for (const option of options) {
    if (option.value === value) {
      selectedLabel = option.label;
      break;
    }
  }
  /**
   * Converts a primitive selection into a supported external value.
   * @param encodedValue - Internal option position supplied by Radix.
   * @returns No value; notifies the owner only for enabled, known options.
   */
  function changeValue(encodedValue: string): void {
    const nextValue = decodeSelectOption(options, encodedValue);
    if (!disabled && nextValue !== undefined) onValueChange(nextValue);
  }

  /**
   * Renders an option while keeping its arbitrary external value private.
   * @param option - Label, external value and availability for this choice.
   * @param index - Position encoded for the selection primitive.
   * @returns A styled option with selection and keyboard-highlight indicators.
   */
  function renderOption(option: SelectOption, index: number): ReactElement {
    return (
      <Select.Item
        key={option.value}
        value={encodeSelectOption(index)}
        disabled={option.disabled}
        className={styles.option}
      >
        <Select.ItemText>{option.label}</Select.ItemText>
        <Select.ItemIndicator className={styles.indicator}>
          <Icon name="check" />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }

  return (
    <div className={styles.field}>
      <label id={`${id}-label`} htmlFor={id} className={styles.label}>
        {label}
      </label>
      <Select.Root
        value={getSelectedOptionValue(options, value)}
        onValueChange={changeValue}
        disabled={disabled}
      >
        <Select.Trigger
          id={id}
          aria-labelledby={`${id}-label`}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(styles.trigger, className)}
        >
          <Select.Value placeholder={placeholder}>{selectedLabel}</Select.Value>
          <Select.Icon className={styles.chevron}>
            <Icon name="chevron-down" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            align="start"
            sideOffset={6}
            collisionPadding={12}
            className={styles.content}
          >
            <Select.ScrollUpButton className={styles.scrollButton}>
              <Icon name="chevron-up" />
            </Select.ScrollUpButton>
            <Select.Viewport className={styles.viewport}>
              {options.map(renderOption)}
            </Select.Viewport>
            <Select.ScrollDownButton className={styles.scrollButton}>
              <Icon name="chevron-down" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
