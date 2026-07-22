import { Heart } from "lucide-react";
import { domainIcons } from "../data/domainIcons";

export function DomainIcon({ icon, className = "w-6 h-6", strokeWidth = 2 }) {
  const Icon = domainIcons[icon] || Heart;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
