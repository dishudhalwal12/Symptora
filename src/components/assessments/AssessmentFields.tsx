import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldShellProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

type AssessmentNumberFieldProps = {
  label: string;
  value: number;
  step?: string;
  onChange: (value: number) => void;
};

type AssessmentSelectFieldProps = {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
};

function FieldShell({ label, children, className }: FieldShellProps) {
  return (
    <div className={cn("flex h-full min-w-0 flex-col justify-between gap-2", className)}>
      <Label className="block min-h-[2.75rem] leading-5 text-gray-700">{label}</Label>
      {children}
    </div>
  );
}

export function AssessmentNumberField({
  label,
  value,
  step,
  onChange,
}: AssessmentNumberFieldProps) {
  return (
    <FieldShell label={label}>
      <Input
        type="number"
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </FieldShell>
  );
}

export function AssessmentSelectField({
  label,
  value,
  options,
  onChange,
}: AssessmentSelectFieldProps) {
  return (
    <FieldShell label={label}>
      <select
        className="field-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
