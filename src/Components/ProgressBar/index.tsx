interface ProgressBarProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
}

export default function ProgressBar({
  percentage,
  size = 200,
  strokeWidth = 15,
  backgroundColor = "#E5EAFC",
}: ProgressBarProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;

  const offset =
    percentage >= 100 ? 0 : circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-full flex justify-center items-center">
      <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
        <path
          d={`
            M ${strokeWidth / 2},${size / 2}
            A ${radius},${radius} 0 ${percentage >= 100 ? 1 : 0} 1 ${
            size - strokeWidth / 2
          },${size / 2}
          `}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={`
            M ${strokeWidth / 2},${size / 2}
            A ${radius},${radius} 0 ${percentage >= 100 ? 1 : 0} 1 ${
            size - strokeWidth / 2
          },${size / 2}
          `}
          fill="none"
          className="stroke-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute bottom-0 w-full flex justify-center mt-2">
        <div>
          <p className="text-[36px] leading-9 text-center text-primary font-semibold">
            {percentage}%
          </p>{" "}
          <p className="text-xs text-primary font-medium">320 prescriptions</p>
        </div>
      </div>
    </div>
  );
}
