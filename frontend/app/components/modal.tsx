"use client";

import { useEffect, useRef } from "react";

function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        const dialogElements = Array.from(
          document.querySelectorAll(".dialog-content")
        );
        for (const element of dialogElements) {
          if (element.contains(event.target as Node)) {
            return;
          }
        }
        onClose();
      }
    };

    if (isOpen) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";

      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.height = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.classList.remove("modal-open");

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="fixed inset-0 bg-black opacity-50 "></div>

      <div
        ref={modalRef}
        className="relative rounded-2xl shadow-lg z-10 w-full sm:w-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
