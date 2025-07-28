import { Boxes, Globe, RefreshCcw, Shield } from "lucide-react";

export const ENTERPRISE_FEATURES = [
    {
        icon: Boxes,
        label: "Multi-language Runtime",
        desc: "Run 10+ languages including C, Java, Go, and Rust",
    },
    {
        icon: Shield,
        label: "Private Execution",
        desc: "Code is executed securely in isolated environments",
    },
];


export const FEATURES = {
    development: [
        "Syntax highlighting",
        "Basic code execution (Free)",
        "Advanced language support (Pro)",
        "Custom font & theme settings",
    ],
    collaboration: [
        "Shareable code links",
        "Auto-save to localStorage",
        "Pro-only history sync (coming soon)",
    ],
    proOnly: [
        "Support for C, C++, Java, C#, Go, Rust, Swift, Ruby, TypeScript",
        "Priority execution with Piston API",
        "More memory & execution time",
    ],
};
