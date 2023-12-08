import { CircleDot } from "lucide-react";

interface Props {
  className?: string;
}

export function Logo({ className }: Props) {
  return <CircleDot className={className} />;
}
