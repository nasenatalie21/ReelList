interface Props {
  value: number | null;
  onChange: (rating: number | null) => void;
}

export default function StarRating({ value, onChange }: Props) {
  return (
    <div className="stars" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= (value || 0) ? "star on" : "star"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          // clicking the current rating clears it
          onClick={() => onChange(n === value ? null : n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
