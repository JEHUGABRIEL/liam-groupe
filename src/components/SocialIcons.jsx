"use client";



const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} {...base}>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4l7.2 9.2L4.4 20h2.6l5.6-6.4L17.6 20H20l-7.5-9.6L19.8 4h-2.6l-5.2 5.9L8.6 4H4z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.83.488 3.634 1.415 5.238L2.04 21.96l4.722-1.375A9.964 9.964 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182c-1.476 0-2.925-.393-4.18-1.132l-.3-.178-2.803.816.817-2.732-.194-.308A8.153 8.153 0 013.818 12c0-4.508 3.674-8.182 8.182-8.182s8.182 3.674 8.182 8.182-3.674 8.182-8.182 8.182zm4.502-6.164c-.246-.123-1.457-.719-1.683-.802-.226-.082-.39-.123-.554.123-.164.246-.637.802-.78.967-.144.164-.287.184-.533.062-.246-.123-1.04-.383-1.98-1.222-.732-.654-1.226-1.461-1.37-1.708-.143-.247-.015-.38.108-.502.11-.11.246-.287.369-.43.123-.144.164-.247.246-.41.082-.164.041-.308-.02-.43-.062-.123-.555-1.337-.76-1.83-.2-.482-.403-.41-.554-.41-.143 0-.308-.02-.472-.02s-.43.062-.656.307c-.226.246-.862.842-.862 2.053s.883 2.382 1.006 2.546c.123.164 1.737 2.652 4.21 3.72.588.254 1.047.406 1.405.52.59.19 1.127.163 1.551.1.473-.07 1.457-.596 1.663-1.172.205-.576.205-1.07.143-1.173-.062-.102-.226-.164-.472-.287z" />
    </svg>
  );
}

export function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} {...base}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} {...base}>
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <path d="M8 11v5M8 8v.01" />
      <path d="M12 16v-4c0-1.1.9-2 2-2s2 .9 2 2v4" />
    </svg>
  );
}
