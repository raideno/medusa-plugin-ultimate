export default <T>(
    array: T[]
): string => {
    const csvRows: string[] = [];

    if (array.length === 0)
        return csvRows.join("\n");

    const columns = Object.keys(array[0]);
    const header = columns.join(",");

    csvRows.push(header);

    array.forEach((arrayRow) => {
        const csvRowValues = Object.values(arrayRow);
        const csvRow = csvRowValues.join(",");
        csvRows.push(csvRow);
    });

    return csvRows.join("\n");
}