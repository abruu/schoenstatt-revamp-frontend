"use client";

import * as React from "react";
import {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subDays,
  subMonths,
  subQuarters,
  subYears,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { DayPicker, DateRange as RDPDateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ─── Types ─────────────────────────────────────────────────────────────────

export type DatePickerMode = "single" | "range";

export interface DatePickerRangeValue {
  from: Date | undefined;
  to: Date | undefined;
}

export type DatePickerValue<M extends DatePickerMode> = M extends "single"
  ? Date | undefined
  : DatePickerRangeValue;

export interface DatePickerProps<M extends DatePickerMode = "range"> {
  mode: M;
  value?: DatePickerValue<M>;
  defaultValue?: DatePickerValue<M>;
  onChange?: (value: DatePickerValue<M>) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  allowQuickPresets?: boolean;
  allowApplyButton?: boolean;
  allowClearButton?: boolean;
  closeOnSelect?: boolean;
  placeholder?: string;
  dateFormat?: string;
  className?: string;
  disabled?: boolean;
}

// ─── Presets ───────────────────────────────────────────────────────────────

interface Preset {
  label: string;
  getValue: () => DatePickerRangeValue;
}

const buildPresets = (): Preset[] => {
  const today = startOfDay(new Date());
  return [
    {
      label: "Today",
      getValue: () => ({ from: today, to: endOfDay(today) }),
    },
    {
      label: "Yesterday",
      getValue: () => {
        const d = subDays(today, 1);
        return { from: d, to: endOfDay(d) };
      },
    },
    {
      label: "Last 30 Days",
      getValue: () => ({ from: subDays(today, 29), to: endOfDay(today) }),
    },
    {
      label: "This Month",
      getValue: () => ({
        from: startOfMonth(today),
        to: endOfMonth(today),
      }),
    },
    {
      label: "Last 3 Months",
      getValue: () => ({
        from: startOfMonth(subMonths(today, 2)),
        to: endOfMonth(today),
      }),
    },
    {
      label: "This Quarter",
      getValue: () => ({
        from: startOfQuarter(today),
        to: endOfQuarter(today),
      }),
    },
    {
      label: "Last Quarter",
      getValue: () => {
        const last = subQuarters(today, 1);
        return { from: startOfQuarter(last), to: endOfQuarter(last) };
      },
    },
    {
      label: "This Year",
      getValue: () => ({
        from: startOfYear(today),
        to: endOfYear(today),
      }),
    },
    {
      label: "Clear Selection",
      getValue: () => ({ from: undefined, to: undefined }),
    },
  ];
};

// ─── Helpers ───────────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function buildYearList(minDate?: Date, maxDate?: Date): number[] {
  const start = minDate ? minDate.getFullYear() : new Date().getFullYear() - 50;
  const end = maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 10;
  const years: number[] = [];
  for (let y = end; y >= start; y--) years.push(y);
  return years;
}

function formatDisplay(
  mode: DatePickerMode,
  value: DatePickerValue<DatePickerMode> | undefined,
  fmt: string,
): string {
  if (!value) return "";
  if (mode === "single") {
    const d = value as Date | undefined;
    return d && isValid(d) ? format(d, fmt) : "";
  }
  const r = value as DatePickerRangeValue;
  if (!r.from && !r.to) return "";
  const fromStr = r.from && isValid(r.from) ? format(r.from, fmt) : "";
  const toStr = r.to && isValid(r.to) ? format(r.to, fmt) : "";
  if (fromStr && toStr) return `${fromStr} – ${toStr}`;
  if (fromStr) return fromStr;
  return toStr;
}

// ─── Main Component ────────────────────────────────────────────────────────

function DatePickerInner<M extends DatePickerMode>(
  props: DatePickerProps<M>,
  _ref: React.Ref<HTMLDivElement>,
) {
  const {
    mode,
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    disabledDates,
    allowQuickPresets = true,
    allowApplyButton = true,
    allowClearButton = true,
    closeOnSelect = false,
    placeholder,
    dateFormat = "dd MMM yyyy",
    className,
    disabled = false,
  } = props;

  const [open, setOpen] = React.useState(false);

  // Internal "pending" state - only committed on Apply
  const [pendingRange, setPendingRange] = React.useState<DatePickerRangeValue>({
    from: undefined,
    to: undefined,
  });
  const [pendingSingle, setPendingSingle] = React.useState<Date | undefined>(
    undefined,
  );
  const [activePreset, setActivePreset] = React.useState<string | null>(null);
  // true = user clicked start date and is now picking the end date
  const [selectingTo, setSelectingTo] = React.useState(false);

  // Month the calendar is showing
  const [displayMonth, setDisplayMonth] = React.useState<Date>(() => {
    const today = new Date();
    if (mode === "range") {
      const rv = (value ?? defaultValue) as DatePickerRangeValue | undefined;
      return rv?.from ?? today;
    }
    const sv = (value ?? defaultValue) as Date | undefined;
    return sv ?? today;
  });

  // Right panel always shows the month after displayMonth
  const rightMonth = React.useMemo(() => {
    const d = new Date(displayMonth);
    d.setMonth(d.getMonth() + 1);
    return d;
  }, [displayMonth]);

  const presets = React.useMemo(() => buildPresets(), []);
  const years = React.useMemo(
    () => buildYearList(minDate, maxDate),
    [minDate, maxDate],
  );

  // When popover opens, sync pending state from controlled value
  React.useEffect(() => {
    if (!open) return;
    if (mode === "range") {
      const rv = value as DatePickerRangeValue | undefined;
      setPendingRange({ from: rv?.from, to: rv?.to });
      if (rv?.from) setDisplayMonth(rv.from);
    } else {
      const sv = value as Date | undefined;
      setPendingSingle(sv);
      if (sv && isValid(sv)) setDisplayMonth(sv);
    }
    setActivePreset(null);
    setSelectingTo(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Handlers ──

  const handleRangeSelect = (range: RDPDateRange | undefined) => {
    if (!range) {
      setPendingRange({ from: undefined, to: undefined });
      setSelectingTo(false);
    } else if (range.from && !range.to) {
      // User clicked a start date — await end date, show no range highlight yet
      setPendingRange({ from: range.from, to: undefined });
      setSelectingTo(true);
    } else if (range.from && range.to) {
      // End date chosen — show full range
      setPendingRange({ from: range.from, to: range.to });
      setSelectingTo(false);
    }
    setActivePreset(null);
    if (closeOnSelect && !allowApplyButton && range?.from && range?.to) {
      commitRange({ from: range.from, to: range.to });
    }
  };

  const handleSingleSelect = (date: Date | undefined) => {
    setPendingSingle(date);
    setActivePreset(null);
    if (closeOnSelect && !allowApplyButton) {
      commitSingle(date);
    }
  };

  const handlePreset = (preset: Preset) => {
    const v = preset.getValue();
    if (preset.label === "Clear Selection") {
      setPendingRange({ from: undefined, to: undefined });
      setPendingSingle(undefined);
      setActivePreset(null);
      setSelectingTo(false);
      if (!allowApplyButton) {
        commitClear();
      }
      return;
    }
    setActivePreset(preset.label);
    setSelectingTo(false);
    if (mode === "range") {
      setPendingRange(v);
      if (v.from) setDisplayMonth(v.from);
    } else {
      setPendingSingle(v.from);
      if (v.from) setDisplayMonth(v.from);
    }
    if (!allowApplyButton) {
      if (mode === "range") {
        onChange?.(v as DatePickerValue<M>);
        setOpen(false);
      } else {
        onChange?.(v.from as DatePickerValue<M>);
        setOpen(false);
      }
    }
  };

  const commitRange = (r: DatePickerRangeValue) => {
    onChange?.(r as DatePickerValue<M>);
    setOpen(false);
  };

  const commitSingle = (d: Date | undefined) => {
    onChange?.(d as DatePickerValue<M>);
    setOpen(false);
  };

  const commitClear = () => {
    if (mode === "range") {
      onChange?.({ from: undefined, to: undefined } as DatePickerValue<M>);
    } else {
      onChange?.(undefined as DatePickerValue<M>);
    }
    setOpen(false);
  };

  const handleApply = () => {
    if (mode === "range") {
      let { from, to } = pendingRange;
      if (from && !to) to = from; // single-day range
      if (from && to && isBefore(to, from)) [from, to] = [to, from];
      commitRange({ from, to });
    } else {
      commitSingle(pendingSingle);
    }
  };

  const handleClear = () => {
    setPendingRange({ from: undefined, to: undefined });
    setPendingSingle(undefined);
    setActivePreset(null);
    commitClear();
  };

  // ── Calendar navigation ──

  const handleMonthDropdown = (month: number) => {
    setDisplayMonth((prev) => new Date(prev.getFullYear(), month, 1));
  };

  const handleYearDropdown = (year: number) => {
    setDisplayMonth((prev) => new Date(year, prev.getMonth(), 1));
  };

  const goToPrevMonth = () => {
    setDisplayMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const goToNextMonth = () => {
    setDisplayMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  // ── Disabled matcher ──

  const disabledMatcher = React.useMemo(() => {
    const matchers: ((d: Date) => boolean)[] = [];
    if (minDate) matchers.push((d) => isBefore(d, startOfDay(minDate)));
    if (maxDate) matchers.push((d) => isAfter(d, endOfDay(maxDate)));
    if (disabledDates?.length) {
      matchers.push((d) =>
        disabledDates.some(
          (dd) =>
            dd.getFullYear() === d.getFullYear() &&
            dd.getMonth() === d.getMonth() &&
            dd.getDate() === d.getDate(),
        ),
      );
    }
    return matchers.length > 0
      ? (d: Date) => matchers.some((m) => m(d))
      : undefined;
  }, [minDate, maxDate, disabledDates]);

  // ── Display value ──

  const displayValue = formatDisplay(mode, value, dateFormat);
  const defaultPlaceholder =
    mode === "range" ? `DD MMM YYYY – DD MMM YYYY` : "DD MMM YYYY";
  const inputPlaceholder = placeholder ?? defaultPlaceholder;

  // ── Render ──

  return (
    <div ref={_ref} className={cn("relative", className)}>
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label="Open date picker"
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn(
              "group flex items-center gap-2 w-full min-w-[220px] h-9 px-3 rounded-md border text-sm transition-all duration-150",
              "bg-slate-700/50 border-slate-600/50 text-white",
              "hover:bg-slate-700 hover:border-blue-500/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
              open && "bg-slate-700 border-blue-500/60 ring-2 ring-blue-500/20",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              !displayValue && "text-slate-400",
            )}
          >
            <CalendarIcon
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-colors",
                displayValue ? "text-blue-400" : "text-slate-500",
              )}
            />
            <span className="flex-1 text-left truncate text-[13px]">
              {displayValue || inputPlaceholder}
            </span>
            {displayValue && allowClearButton ? (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear date"
                className="shrink-0 flex items-center justify-center w-4 h-4 rounded text-slate-400 hover:text-white hover:bg-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    handleClear();
                  }
                }}
              >
                <X className="h-3 w-3" />
              </span>
            ) : (
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/50 rounded-xl overflow-hidden"
          align="start"
          sideOffset={8}
        >
          <div className="flex">
            {/* ── Presets sidebar ── */}
            {allowQuickPresets && (
              <div className="flex flex-col w-[148px] shrink-0 border-r border-slate-700/60">
                <div className="px-3 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Quick Select
                </div>
                <div className="flex flex-col pb-2 overflow-y-auto max-h-[356px]">
                  {presets.map((preset) =>
                    preset.label === "Clear Selection" ? (
                      <div
                        key={preset.label}
                        className="mt-1 mx-2 pt-1 border-t border-slate-700/60"
                      >
                        <button
                          type="button"
                          onClick={() => handlePreset(preset)}
                          className="w-full text-left px-2 py-1.5 text-[13px] rounded-md text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          {preset.label}
                        </button>
                      </div>
                    ) : (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handlePreset(preset)}
                        className={cn(
                          "text-left mx-2 px-2 py-1.5 text-[13px] rounded-md transition-colors",
                          activePreset === preset.label
                            ? "bg-blue-500/15 text-blue-300 font-medium"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white",
                        )}
                      >
                        {preset.label}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* ── Calendar area ── */}
            <div className="flex flex-col min-w-0">
              {/* Dual-month navigation header */}
              <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                <button
                  type="button"
                  onClick={goToPrevMonth}
                  aria-label="Previous month"
                  className="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/70 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1 flex-1 justify-center">
                  <MonthYearSelect
                    monthValue={displayMonth.getMonth()}
                    yearValue={displayMonth.getFullYear()}
                    years={years}
                    onMonthChange={handleMonthDropdown}
                    onYearChange={handleYearDropdown}
                    monthLabel="Select start month"
                    yearLabel="Select start year"
                  />
                </div>

                <div className="w-px h-4 bg-slate-700 shrink-0" />

                <div className="flex items-center gap-1 flex-1 justify-center">
                  <MonthYearSelect
                    monthValue={rightMonth.getMonth()}
                    yearValue={rightMonth.getFullYear()}
                    years={years}
                    onMonthChange={(m) => {
                      const newRight = new Date(rightMonth.getFullYear(), m, 1);
                      const newLeft = new Date(newRight);
                      newLeft.setMonth(newLeft.getMonth() - 1);
                      setDisplayMonth(newLeft);
                    }}
                    onYearChange={(y) => {
                      const newRight = new Date(y, rightMonth.getMonth(), 1);
                      const newLeft = new Date(newRight);
                      newLeft.setMonth(newLeft.getMonth() - 1);
                      setDisplayMonth(newLeft);
                    }}
                    monthLabel="Select end month"
                    yearLabel="Select end year"
                  />
                </div>

                <button
                  type="button"
                  onClick={goToNextMonth}
                  aria-label="Next month"
                  className="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/70 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* DayPicker — two months side by side */}
              {mode === "range" ? (
                <DayPicker
                  mode="range"
                  month={displayMonth}
                  onMonthChange={setDisplayMonth}
                  numberOfMonths={2}
                  selected={
                    pendingRange.from
                      ? selectingTo
                        ? { from: pendingRange.from, to: undefined }
                        : { from: pendingRange.from, to: pendingRange.to }
                      : undefined
                  }
                  onSelect={handleRangeSelect}
                  disabled={disabledMatcher}
                  showOutsideDays
                  classNames={calendarClassNames}
                />
              ) : (
                <DayPicker
                  mode="single"
                  month={displayMonth}
                  onMonthChange={setDisplayMonth}
                  numberOfMonths={2}
                  selected={pendingSingle}
                  onSelect={handleSingleSelect}
                  disabled={disabledMatcher}
                  showOutsideDays
                  classNames={calendarClassNames}
                />
              )}

              {/* Footer */}
              {(allowApplyButton || allowClearButton) && (
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-slate-700/60">
                  <span
                    className={cn(
                      "text-[12px] tabular-nums min-w-0 truncate transition-colors",
                      selectingTo ? "text-slate-300" : "text-slate-500",
                    )}
                  >
                    {mode === "range"
                      ? (() => {
                          const { from, to } = pendingRange;
                          if (selectingTo && from)
                            return `${format(from, "dd/MM/yyyy")} → pick end date`;
                          if (from && to)
                            return `${format(from, "dd/MM/yyyy")} – ${format(to, "dd/MM/yyyy")}`;
                          if (from) return format(from, "dd/MM/yyyy");
                          return "Select a start date";
                        })()
                      : pendingSingle && isValid(pendingSingle)
                        ? format(pendingSingle, "dd/MM/yyyy")
                        : "Select a date"}
                  </span>
                  <div className="flex gap-2 shrink-0">
                    {allowClearButton && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="px-3 py-1.5 text-[12px] font-medium rounded-md border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40"
                      >
                        Clear
                      </button>
                    )}
                    {allowApplyButton && (
                      <button
                        type="button"
                        onClick={handleApply}
                        className="px-4 py-1.5 text-[12px] font-semibold rounded-md bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ─── MonthYearSelect sub-component ────────────────────────────────────────

function MonthYearSelect({
  monthValue,
  yearValue,
  years,
  onMonthChange,
  onYearChange,
  monthLabel,
  yearLabel,
}: {
  monthValue: number;
  yearValue: number;
  years: number[];
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
  monthLabel: string;
  yearLabel: string;
}) {
  return (
    <>
      <div className="relative">
        <select
          value={monthValue}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          aria-label={monthLabel}
          className="appearance-none bg-slate-800 border border-slate-700 text-white text-[13px] font-medium rounded-md pl-2.5 pr-6 py-1 cursor-pointer hover:border-blue-500/50 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-150"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i} className="bg-slate-900">
              {m}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
      </div>
      <div className="relative">
        <select
          value={yearValue}
          onChange={(e) => onYearChange(Number(e.target.value))}
          aria-label={yearLabel}
          className="appearance-none bg-slate-800 border border-slate-700 text-white text-[13px] font-medium rounded-md pl-2.5 pr-6 py-1 cursor-pointer hover:border-blue-500/50 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-150"
        >
          {years.map((y) => (
            <option key={y} value={y} className="bg-slate-900">
              {y}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
      </div>
    </>
  );
}

// ─── Calendar class names (dark theme) ────────────────────────────────────

const calendarClassNames: React.ComponentProps<typeof DayPicker>["classNames"] =
  {
    months:
      "flex flex-row gap-0 relative px-4 pb-1 divide-x divide-slate-700/50",
    month: "flex flex-col gap-0 px-3 first:pl-0 last:pr-0",
    nav: "hidden",
    month_caption: "hidden",
    table: "w-full border-collapse",
    weekdays: "flex",
    weekday:
      "text-slate-500 flex-1 font-medium text-[11px] text-center select-none w-10 h-8 flex items-center justify-center",
    week: "flex w-full",
    day: "relative p-0 text-center select-none",
    day_button:
      "w-10 h-10 mx-auto flex items-center justify-center rounded-md text-[13px] font-normal text-slate-300 transition-all duration-100 hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 aria-disabled:opacity-25 aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent aria-disabled:hover:text-slate-300",
    selected: "bg-blue-600 text-white rounded-md hover:bg-blue-500",
    today: "text-blue-400 font-semibold",
    outside:
      "opacity-30 [&>button]:hover:bg-transparent [&>button]:cursor-default",
    disabled: "opacity-25 cursor-not-allowed",
    range_start: "bg-blue-600 text-white rounded-l-md rounded-r-none",
    range_end: "bg-blue-600 text-white rounded-r-md rounded-l-none",
    range_middle: "bg-blue-500/15 text-slate-200 rounded-none",
    hidden: "invisible",
  };

// ─── Exports ───────────────────────────────────────────────────────────────

export const DatePicker = React.forwardRef(DatePickerInner) as <
  M extends DatePickerMode = "range",
>(
  props: DatePickerProps<M> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

// ─── Utility: parse date filter string ↔ DatePickerRangeValue ─────────────

export function parseDateFilterString(str: string): DatePickerRangeValue {
  try {
    const rangeMatch = str.match(
      /^(\d{2}\/\d{2}\/\d{4})\s*[-–]\s*(\d{2}\/\d{2}\/\d{4})$/,
    );
    if (rangeMatch) {
      const from = parse(rangeMatch[1], "dd/MM/yyyy", new Date());
      const to = parse(rangeMatch[2], "dd/MM/yyyy", new Date());
      if (isValid(from) && isValid(to)) return { from, to };
    }
    const singleMatch = str.match(/^(\d{2}\/\d{2}\/\d{4})$/);
    if (singleMatch) {
      const from = parse(singleMatch[1], "dd/MM/yyyy", new Date());
      if (isValid(from)) return { from, to: from };
    }
  } catch {
    // ignore
  }
  return { from: undefined, to: undefined };
}

export function formatDateFilterString(range: DatePickerRangeValue): string {
  const { from, to } = range;
  if (!from) return "";
  const fromStr = format(from, "dd/MM/yyyy");
  if (!to) return fromStr;
  const toStr = format(to, "dd/MM/yyyy");
  return `${fromStr} - ${toStr}`;
}
