import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string"
          ? { value: option, label: option }
          : option
      ),
    [options]
  );

  const selectedIndex = normalizedOptions.findIndex(
    (option) => option.value === value
  );
  const selectedOption =
    selectedIndex >= 0 ? normalizedOptions[selectedIndex] : null;

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [open, selectedIndex]);

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    if (disabled) return;
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    if (!open && ["ArrowDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      return;
    }

    if (!open) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) =>
        Math.min(prev + 1, normalizedOptions.length - 1)
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const option = normalizedOptions[activeIndex];
      if (option) {
        handleSelect(option);
      }
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`tak-select tak-select-trigger w-full ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span
          className={`truncate ${
            selectedOption ? "text-gray-900 dark:text-gray-100" : "text-gray-400"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`tak-select-menu ${menuClassName}`}
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {normalizedOptions.map((option, index) => (
            <button
              key={option.value}
              type="button"
              className="tak-select-option"
              data-active={index === activeIndex}
              data-selected={option.value === value}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.value === value}
            >
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
