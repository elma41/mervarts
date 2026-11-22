type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const IconBag = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
);
export const IconWhatsApp = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>
);
export const IconInstagram = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
);
export const IconArrow = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconStar = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8L12 3Z"/></svg>
);
export const IconBrush = ({ className = "w-6 h-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M14 4l6 6-7.5 7.5a3 3 0 0 1-2.1.9H7v-3.4a3 3 0 0 1 .9-2.1L14 4Z" /><path d="M4 20c1.5 0 3-1 3-1.6" /></svg>
);
export const IconHeart = ({ className = "w-6 h-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
);
export const IconPackage = ({ className = "w-6 h-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></svg>
);
export const IconClose = ({ className = "w-6 h-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconChevron = ({ className = "w-6 h-6", dir = "right" }: P & { dir?: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>{dir === "right" ? <path d="m9 5 7 7-7 7" /> : <path d="m15 5-7 7 7 7" />}</svg>
);
export const IconMenu = ({ className = "w-6 h-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 7h16M4 12h16M4 17h10" /></svg>
);
export const IconZoom = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5M11 8.5v5M8.5 11h5" /></svg>
);
