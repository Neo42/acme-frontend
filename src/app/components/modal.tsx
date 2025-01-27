"use client";

import { createPortal } from "react-dom";

import { X } from "lucide-react";

import { Header } from "@/app/components/header";

export const Modal = ({
  children,
  isOpen,
  onClose,
  name,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 flex size-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4"
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Header name={name} textSize="text-lg">
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-blue-600"
          >
            <X size={18} />
          </button>
        </Header>
        {children}
      </div>
    </div>,
    document.body,
  );
};
