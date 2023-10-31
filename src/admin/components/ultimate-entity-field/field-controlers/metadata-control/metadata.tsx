import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import InputField from "./input-field";
import { Badge, Button, IconBadge, Tooltip } from "@medusajs/ui";
import { Plus, Trash } from "@medusajs/icons";

// number of columns and their names is predetermined

type AddMetadataProps = {
  metadata: {
    [key: string]: {
      [column: string]: string;
    };
  };
  columns: { name: string; placeholder?: string; defaultValue?: string }[];
  setMetadata: (metadata: {
    [key: string]: {
      [column: string]: string;
    };
  }) => void;
};

export type MetadataField = {
  key: string;
  columns: {
    [key: string]: string;
  };
};

const Metadata: React.FC<AddMetadataProps> = ({
  metadata,
  setMetadata,
  columns,
}) => {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<{
    [key: string]: {
      [column: string]: string;
    };
  }>({});

  useEffect(() => {
    setLocalData(metadata);
  }, [metadata]);

  // function addColumn(columnName: string, defaultValue: string): boolean {
  //   // columns must have lowercase names with only alphanumeric characters and underscore
  //   const newLocalData = JSON.parse(
  //     JSON.stringify(localData)
  //   ) as typeof localData;

  //   for (const key in newLocalData) {
  //     const columns = newLocalData[key];

  //     columns[columnName] = defaultValue;
  //   }

  //   setLocalData(newLocalData);

  //   return true;
  // }

  // function deleteColumn(columnName: string): boolean {
  //   const newLocalData = JSON.parse(
  //     JSON.stringify(localData)
  //   ) as typeof localData;

  //   for (const key in newLocalData) {
  //     const columns = newLocalData[key];

  //     columns[columnName] = undefined;
  //     delete columns[columnName];
  //   }

  //   setLocalData(newLocalData);

  //   return true;
  // }

  function addRow(
    keyName: string = String(Date.now()).slice(0, 5) +
      String(Math.random()).slice(0, 4),
    ...columnValues
  ) {
    // TODO: columns with name of "key" aren't permited
    const newLocalData = JSON.parse(
      JSON.stringify(localData)
    ) as typeof localData;

    newLocalData[keyName] = {};

    columns.forEach((column) => (newLocalData[keyName][column.name] = ""));

    setLocalData(newLocalData);
    setMetadata(newLocalData);

    return true;
  }

  function deleteRow(keyName: string) {
    const newLocalData = JSON.parse(
      JSON.stringify(localData)
    ) as typeof localData;

    delete newLocalData[keyName];
    // newLocalData[keyName] = undefined;

    setLocalData(newLocalData);
    setMetadata(newLocalData);
  }

  function onColumnValueChange(
    keyName: string,
    columnName: string,
    value: string
  ) {
    const newLocalData = JSON.parse(
      JSON.stringify(localData)
    ) as typeof localData;

    newLocalData[keyName][columnName] = value;

    setLocalData(newLocalData);
    setMetadata(newLocalData);
  }

  function onKeyValueChange(keyName: string, newKeyName: string) {
    const newLocalData = JSON.parse(
      JSON.stringify(localData)
    ) as typeof localData;

    newLocalData[newKeyName] = JSON.parse(
      JSON.stringify(newLocalData[keyName])
    );

    newLocalData[keyName] = undefined;
    delete newLocalData[keyName];

    setLocalData(newLocalData);
    setMetadata(newLocalData);
  }

  return (
    <div className="mt-base gap-y-base flex flex-col">
      {Object.keys(localData).map((key) => {
        return (
          <Field
            field={{
              key,
              columns: localData[key],
            }}
            columns={columns}
            deleteRow={deleteRow.bind(null, key)}
            updateKeyName={onKeyValueChange.bind(null, key)}
            updateColumnValue={onColumnValueChange.bind(null, key)}
          />
        );
      })}
      <div>
        <Button
          variant="secondary"
          type="button"
          className="w-full"
          onClick={() =>
            addRow("new-row-" + String(Date.now()) + String(Math.random()))
          }
        >
          <Plus width={20} height={20} />
          {t("metadata-add-metadata", "Add Metadata")}
        </Button>
      </div>
    </div>
  );
};

type FieldProps = {
  columns: { name: string; placeholder?: string; defaultValue?: string }[];
  field: MetadataField;
  updateKeyName: (newKeyName: string) => void;
  updateColumnValue: (columnName: string, columnValue: string) => void;
  deleteRow: () => void;
  // ---
};

const Field: React.FC<FieldProps> = ({
  columns,
  field,
  updateKeyName,
  updateColumnValue,
  deleteRow,
}) => {
  return (
    <div className="gap-x-xsmall flex w-full items-center">
      <div className="maw-w-[200px]">
        <InputField
          // label="Key"
          disabled
          placeholder="Some key"
          defaultValue={field.key}
          onChange={(e) => {
            updateKeyName(e.currentTarget.value);
          }}
        />
      </div>
      <div className="flex flex-row gap-x-xsmall flex-grow">
        {Object.keys(field.columns)
          .sort()
          .map((columnName) => {
            const col = columns.find((c) => c.name === columnName)!;
            return (
              <InputField
                placeholder={col.placeholder}
                defaultValue={field.columns[columnName]}
                onChange={(e) => {
                  updateColumnValue(columnName, e.currentTarget.value);
                }}
              />
            );
          })}
      </div>
      <Tooltip content="Delete row.">
        <Badge
          onClick={deleteRow}
          className="group cursor-pointer hover:opacity-75 hover:bg-ui-button-danger-hover active:bg-ui-button-danger-pressed active:opacity-50 w-9 h-9 aspect-square flex flex-row items-center justify-center"
        >
          <Trash className="group-hover:border-white group-hover:text-white" />
        </Badge>
      </Tooltip>
    </div>
  );
};

export default Metadata;
