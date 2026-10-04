import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="mt-1 text-xs text-ink-muted">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">{children}</div>
      </CardContent>
    </Card>
  );
}