type TimelineEntryProps = {
  date: string;
  title: string;
  subtitle?: string;
  description?: string;
};

export default function TimelineEntry({
  date,
  title,
  subtitle,
  description,
}: TimelineEntryProps) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-5">
      <p className="font-sans text-base font-medium leading-snug text-ink/40">
        {date}
      </p>
      <div>
        <p className="font-sans text-base font-semibold">{title}</p>
        {subtitle && (
          <p className="font-sans text-base font-medium italic text-ink/50">{subtitle}</p>
        )}
        {description && (
          <p className="mt-2 font-sans text-base font-light leading-relaxed text-ink">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}