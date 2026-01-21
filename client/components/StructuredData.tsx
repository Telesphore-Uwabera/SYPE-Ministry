import { useEffect } from "react";

interface StructuredDataProps {
    data: Record<string, any>;
}

/**
 * Component to inject JSON-LD structured data into the <head>
 */
export default function StructuredData({ data }: StructuredDataProps) {
    useEffect(() => {
        // Remove any existing script tag with the same ID if we had one
        // But since pages might have multiple schemas, we'll just append.
        // Clean up would be good but standard JSON-LD just stays.

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify(data);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [data]);

    return null;
}
