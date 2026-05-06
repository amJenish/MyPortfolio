import React from "react";
import "./drawnButton.css";

export interface DrawnButtonProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}

export function DrawnButton({ href, label, icon, external = false }: DrawnButtonProps) {
  return (
    <a
      href={href}
      className="drawn-button"
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <div className="drawn-button__line" />
      <div className="drawn-button__line" />
      <span className="drawn-button__text">
        {icon}
        <span>{label}</span>
      </span>
      <div className="drawn-button__drow1" />
      <div className="drawn-button__drow2" />
    </a>
  );
}
