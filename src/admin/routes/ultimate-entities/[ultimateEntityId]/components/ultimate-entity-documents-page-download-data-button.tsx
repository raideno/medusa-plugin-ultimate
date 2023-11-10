"use client";

import { useState } from "react";

import { Button, useToast } from "@medusajs/ui";
import { ArrowDownTray } from "@medusajs/icons";

import { useUltimateEntityDocumentsPage } from "../../../../contexts/ultimate-entity-documents-page";

import Skeleton from "../../../../components/layout/skeleton";
import objectsArrayToCsvString from "../../../../utils/objects-array-to-csv-string";
import createCsvBlobFromCsvString from "../../../../utils/create-csv-blob-from-csv-string";
import { UltimateEntity } from "../../../../../types/ultimate-entity";

interface UltimateEntityDocumentsPageDownloadDataButtonProps {
    ultimateEntity: UltimateEntity
}

const UltimateEntityDocumentsPageDownloadDataButton = ({ ultimateEntity }: UltimateEntityDocumentsPageDownloadDataButtonProps) => {

    const { toast } = useToast();

    const { documents, isLoading, error } = useUltimateEntityDocumentsPage();

    const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false);

    async function handleButtonClick() {
        if (isDownloadLoading)
            return;

        setIsDownloadLoading(true);

        try {

            const csvString = objectsArrayToCsvString(documents);
            const csvBlob = createCsvBlobFromCsvString(csvString);
            const csvFileUrl = window.URL.createObjectURL(csvBlob);

            const a = document.createElement('a')

            a.setAttribute('href', csvFileUrl)
            a.setAttribute('download', `ultimate*entity-${ultimateEntity.id}-documents.csv`);
            a.click()

            toast({
                variant: "success",
                title: "Documents have been downloaded.",
                description: "Check your download tab."
            })
        } catch (err: any) {
            console.log("[medusa-plugin-ultimate](UltimateEntityDocumentsPageDownloadDataButton-handleButtonClick):", err);
            toast({
                variant: "error",
                title: "Failed to Download Documents.",
                description: "Check the console to know more or Try again."
            })
        } finally {
            setIsDownloadLoading(false);
        }
    }

    if (isLoading)
        return <Skeleton className="rounded h-8 w-[144.55px] rounded-tl-none rounded-bl-none" />;

    if (error)
        return null;

    return (
        <Button isLoading={isDownloadLoading} disabled={isDownloadLoading} className="rounded-tl-none rounded-bl-none" variant="secondary" onClick={handleButtonClick}>
            <ArrowDownTray />
            Download Data
        </Button>
    )
}

export default UltimateEntityDocumentsPageDownloadDataButton;