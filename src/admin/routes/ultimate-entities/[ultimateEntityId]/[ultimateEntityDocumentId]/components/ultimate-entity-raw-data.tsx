import { CodeBlock, Heading } from "@medusajs/ui";

import { useUltimateEntityDocumentPage } from "../../../../../contexts/ultimate-entity-document-page";

import Skeleton from "../../../../../components/layout/skeleton";
import ErrorLayout from "../../../../../components/layout/error-layout";

interface UltimateEntityRawDataProps {
}

const UltimateEntityRawData = ({
}: UltimateEntityRawDataProps) => {

    const { document, isLoading, error } = useUltimateEntityDocumentPage();

    if (isLoading) return <Skeleton className="w-full h-32" />;

    if (error) return <ErrorLayout />;

    return (
        <div className="mt-xsmall w-full bg-white rounded border border-border p-4">
            <Heading className="inter-xlarge-semibold mb-xsmall">Raw Document Data</Heading>
            <CodeBlock
                snippets={[
                    {
                        language: "json",
                        label: "Documebt",
                        code: JSON.stringify(document, null, 2),
                    },
                ]}
            >
                <CodeBlock.Header />
                <CodeBlock.Body />
            </CodeBlock>
        </div>
    )
}

export default UltimateEntityRawData;