"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { humanizeEnum } from "@/lib/utils/format";

const COLOR_MAP: Record<string, string> = {
  CITIZEN: "#8a9e7b",
  AGENT: "#e9b86b",
  ADMIN: "#4b1d22",

  PENDING: "#e9b86b",
  ASSIGNED: "#8a9e7b",
  IN_PROGRESS: "#d98e4a",
  RESOLVED: "#4f8a5b",
  CLOSED: "#6b5a52",
  REJECTED: "#c0553a",

  PAID: "#8a9e7b",
  IN_REVIEW: "#d98e4a",
  APPROVED: "#4f8a5b",
  COMPLETED: "#4f8a5b",
  PENDING_PAYMENT: "#e9b86b",

  LOW: "#6b5a52",
  MEDIUM: "#8a9e7b",
  HIGH: "#e9b86b",
  URGENT: "#c0553a",
};

const FALLBACK = "#8a9e7b";

function normalizeTooltipValue(
  value: number | string | readonly (number | string)[] | undefined,
) {
  const normalized =
    typeof value === "number" || typeof value === "string" ? value : value?.[0];
  const numeric =
    typeof normalized === "number"
      ? normalized
      : Number(normalized ?? 0);

  return Number.isFinite(numeric) ? numeric : 0;
}

export interface RoleBreakdownDatum {
  name: string;
  value: number;
}

export function UsersByRoleChart({ data }: { data: RoleBreakdownDatum[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return <EmptyChart message="No users yet" />;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
          stroke="#fffbf0"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={COLOR_MAP[entry.name] ?? FALLBACK}
            />
          ))}
        </Pie>
        <Legend
          verticalAlign="bottom"
          height={28}
          formatter={(value) => humanizeEnum(String(value))}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "2px solid #4b1d22",
            background: "#fffbf0",
            fontSize: 12,
          }}
          formatter={(value) => [normalizeTooltipValue(value), "Users"]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export interface StatusBreakdownDatum {
  name: string;
  value: number;
}

export function ComplaintsByStatusChart({
  data,
}: {
  data: StatusBreakdownDatum[];
}) {
  if (data.every((d) => d.value === 0)) {
    return <EmptyChart message="No complaints yet" />;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2d8c2" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#6b5a52" }}
          tickFormatter={(v) => humanizeEnum(String(v))}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fontSize: 11, fill: "#6b5a52" }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "2px solid #4b1d22",
            background: "#fffbf0",
            fontSize: 12,
          }}
          formatter={(value) => [normalizeTooltipValue(value), "Complaints"]}
          labelFormatter={(label) => humanizeEnum(String(label))}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={COLOR_MAP[entry.name] ?? FALLBACK}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ComplaintsByPriorityChart({
  data,
}: {
  data: StatusBreakdownDatum[];
}) {
  if (data.every((d) => d.value === 0)) {
    return <EmptyChart message="No complaints yet" />;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
          stroke="#fffbf0"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={COLOR_MAP[entry.name] ?? FALLBACK}
            />
          ))}
        </Pie>
        <Legend
          verticalAlign="bottom"
          height={28}
          formatter={(value) => humanizeEnum(String(value))}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "2px solid #4b1d22",
            background: "#fffbf0",
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export interface RevenueDatum {
  label: string;
  amount: number;
}

export function RevenueChart({ data }: { data: RevenueDatum[] }) {
  if (data.length === 0) {
    return <EmptyChart message="No revenue yet" />;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2d8c2" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#6b5a52" }}
        />
        <YAxis tick={{ fontSize: 11, fill: "#6b5a52" }} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "2px solid #4b1d22",
            background: "#fffbf0",
            fontSize: 12,
          }}
          formatter={(value) => [
            `$${normalizeTooltipValue(value).toFixed(2)}`,
            "Revenue",
          ]}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#4b1d22"
          strokeWidth={2}
          dot={{ r: 3, fill: "#8a9e7b", stroke: "#4b1d22" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-md border-2 border-dashed border-border-strong bg-surface-2/40">
      <p className="text-sm text-ink-muted">{message}</p>
    </div>
  );
}

export { COLOR_MAP };