import "./ProgressBar.css"

export type ProgressBarProps = {
    value: number
    size: number
    width: number
    text?: number | string
}

export function ProgressBar({value, size, width, text}: ProgressBarProps)
{
    const radius = (size - width)/2
    const circumfrence = radius * Math.PI * 2
    return <svg width={size} height={size}>
        <circle strokeWidth={width}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="gray"
        strokeDasharray={circumfrence}
        />
        <circle className="valueBar" strokeWidth={width}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#0a3c8c"
        strokeDasharray={circumfrence}
        strokeDashoffset={circumfrence - circumfrence * (value)}/>
        <text
        textAnchor="middle"
        dominantBaseline="middle"
        x="50%"
        y="50%">{text}</text>
    </svg>
}