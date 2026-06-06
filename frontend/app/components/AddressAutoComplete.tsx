"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MapPin, AlertCircle } from "lucide-react";

interface ReliableAddressAutocompleteProps {
  value?: string;
  onChange: (address: string, lat: number, lng: number) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  className?: string;
  showIcon?: boolean;
  variant?: "profile" | "search";
}

export default function ReliableAddressAutocomplete({
  value = "",
  onChange,
  id = "location",
  name = "location",
  placeholder = "Geben Sie Ihren Standort an",
  label,
  required = false,
  errorMessage,
  className,
  showIcon = true,
  variant = "profile",
}: ReliableAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    let interval: number | null = null;

    const maybeInitAutocomplete = () => {
      if (!window.google || !window.google.maps) return;
      if (!inputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["address"] }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location || !place.formatted_address) {
          return;
        }
        onChange(
          place.formatted_address,
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );
      });

      setHasInitialized(true);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const pacItems = document.querySelectorAll(".pac-item");
            pacItems.forEach((item) => {
              if (!item.querySelector(".custom-pin-container")) {
                const pinContainer = document.createElement("div");
                pinContainer.className = "custom-pin-container";

                const pinIcon = document.createElement("div");
                pinIcon.className = "custom-pin-icon";
                pinIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                       viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="lucide lucide-map-pin" style="color: #333;">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                `;
                pinContainer.appendChild(pinIcon);
                item.insertBefore(pinContainer, item.firstChild);
              }

              if (!item.querySelector(".pac-item-text-wrapper")) {
                const textWrapper = document.createElement("div");
                textWrapper.className = "pac-item-text-wrapper";
                const children = Array.from(item.childNodes).filter(
                  (node) =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    !(node as Element).classList.contains("custom-pin-container")
                );
                children.forEach((child) => textWrapper.appendChild(child));
                item.appendChild(textWrapper);
              }
            });
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    };

    interval = window.setInterval(() => {
      if (!hasInitialized) {
        maybeInitAutocomplete();
      }
    }, 300);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [onChange, hasInitialized]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const selectedItem = document.querySelector(".pac-item-selected");
        if (!selectedItem) {
          e.preventDefault();
        }
      }
    };
    el.addEventListener("keydown", handleKeyDown);

    return () => {
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (variant !== "search") return;

    let containerObserver: MutationObserver | null = null;
    let bodyObserver: MutationObserver | null = null;

    const reposition = () => {
      const input = inputRef.current;
      if (!input) return;
      const anchor = input.closest(".location-field-container") as HTMLElement | null;
      if (!anchor) return;
      const pacContainer = document.querySelector(".pac-container") as HTMLElement | null;
      if (!pacContainer) return;

      const rect = anchor.getBoundingClientRect();
      const desiredLeft = `${rect.left + window.scrollX}px`;
      if (pacContainer.style.left !== desiredLeft) {
        pacContainer.style.left = desiredLeft;
      }
    };

    const attachToContainer = (pacContainer: HTMLElement) => {
      if (containerObserver) return;
      reposition();
      containerObserver = new MutationObserver(reposition);
      containerObserver.observe(pacContainer, {
        attributes: true,
        attributeFilter: ["style"],
      });
    };

    const existing = document.querySelector(".pac-container") as HTMLElement | null;
    if (existing) {
      attachToContainer(existing);
    } else {
      bodyObserver = new MutationObserver(() => {
        const pacContainer = document.querySelector(".pac-container") as HTMLElement | null;
        if (pacContainer) {
          attachToContainer(pacContainer);
          bodyObserver?.disconnect();
          bodyObserver = null;
        }
      });
      bodyObserver.observe(document.body, { childList: true });
    }

    const handleWindowChange = () => reposition();
    window.addEventListener("resize", handleWindowChange);
    window.addEventListener("scroll", handleWindowChange, true);

    return () => {
      containerObserver?.disconnect();
      bodyObserver?.disconnect();
      window.removeEventListener("resize", handleWindowChange);
      window.removeEventListener("scroll", handleWindowChange, true);
    };
  }, [variant]);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
    .pac-container {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        margin-top: 8px;
        padding: 8px;
        background: white;
        font-family: inherit;
        z-index: 99999 !important; /* ensure it's on top of everything */
        width: 500px !important;
        min-width: 400px !important;

        /* Mobile styles */
        @media (max-width: 768px) {
          width: 100vw !important;
          min-width: 100vw !important;
          border-radius: 0;
          margin-top: 4px;
          left: 0 !important;
          transform: none !important;
        }
      }
      .pac-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 4px;
        cursor: pointer;
        background-color: #f2f2f2;
      }
      .pac-item:hover {
        background-color: #e9e9e9;
      }
      .pac-icon {
        display: none;
      }
      .pac-item-text-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
        font-size: 16px;
        color: #333;
        overflow-wrap: anywhere;
      }
      .pac-item-query,
      .pac-item span:not(.pac-item-query) {
        font-size: 16px;
        color: #333;
        font-weight: 400 !important;
      }
      .pac-matched {
        font-weight: 500 !important;
      }
      .custom-pin-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        min-width: 48px;
        background-color: #e0e0e0;
        border-radius: 12px;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const inputClasses = variant === "profile"
    ? cn(
      "w-full py-3 pr-4 border-2 rounded-md focus:outline-none focus:ring-0 transition-colors",
      showIcon ? "pl-12" : "pl-4",
      isFocused
        ? "border-primary"
        : errorMessage
          ? "border-red-300 focus-visible:ring-red-300"
          : "border-gray-300"
    )
    : cn(
      "w-full border-none bg-transparent focus:outline-none focus:ring-0 text-[16px] -py-[1px]",
      className
    );

  return (
    <div className={cn("flex flex-col", variant === "profile" && "ml-8", className)}>
      {label && (
        <label htmlFor={id} className="text-base font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={cn("relative text-base mt-2", variant === "search" && "mt-0")}>
        {showIcon && variant === "profile" && (
          <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
        )}

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {errorMessage && variant === "profile" && (
          <div className="absolute right-3 top-3.5 text-red-500">
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      {errorMessage && variant === "profile" && (
        <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
