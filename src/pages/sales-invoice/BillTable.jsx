import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  TextField,
} from "@mui/material";
import Input from "../../component/common/Input";
import axiosPrivate from "../../api/BaseURL";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const BillTable = ({
  rowFormData,
  selectedRows,
  setSelectedRows,
  avaibaleRows,
  setAvaibaleRows,
  rowFormFields,
  setRowFormFields,
  totalQuantity,
  setTotalQuantity,
  totalAmount,
  setTotalAmount,
}) => {
  const totalRows = 10; // Set the initial value of totalRows

  const rowForm = [
    {
      id: "no",
      type: "text",
      disabled: true,
    },
    {
      id: "item",
      type: "select",
      endpoint: "Item?filters={%22is_sales_item%22:1,%22has_variants%22:0}",
    },
    {
      id: "qty",
      type: "text",
    },
    {
      id: "rate",
      type: "text",
    },
    {
      id: "amount",
      type: "text",
      disabled: true,
    },
  ];

  const handleSelectAllRows = (event) => {
    if (event.target.checked) {
      // Select all rows
      const allRows = ["row1", "row2", "row3"]; // Replace with your row data
      setSelectedRows(allRows);
    } else {
      // Deselect all rows
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, row) => {
    const selectedIndex = selectedRows.indexOf(row);
    let newSelectedRows = [];

    if (selectedIndex === -1) {
      newSelectedRows = [...selectedRows, row];
    } else {
      newSelectedRows = selectedRows.filter(
        (selectedRow) => selectedRow !== row
      );
    }

    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === totalRows) {
      setSelectedRows([]);
    } else {
      const allRows = ["row1", "row2", "row3"]; // Replace with your row data
      setSelectedRows(allRows);
    }
  };

  const handleRemoveAll = () => {
    setSelectedRows([]);
  };

  const removeField = (index) => {
    const removeAvailable = [...avaibaleRows];
    const removeRowForm = [...rowFormFields];
    removeAvailable?.splice(index, 1);
    removeRowForm?.splice(index, 1);
    setAvaibaleRows(removeAvailable);
    setRowFormFields(removeRowForm);
  };

  const handleAddRow = () => {
    // Add a new row to the table
    // Perform the necessary logic to add a row

    // For example:
    // const newRow = ""; // Replace with your new row data
    setAvaibaleRows((prevSelectedRows) => [...prevSelectedRows, rowFormData]);
    setRowFormFields((prevSelectedRows) => [...prevSelectedRows, rowFormData]);
  };

  const handleInputChange = async (val, field, index) => {
    // setAppointmentData((prev) => ({ ...prev, [field.id]: val }));
    const updatedFormFields = [...rowFormFields];
    if (field.id === "item") {
      await axiosPrivate.get(`/api/resource/Item/${val}`).then((itemRes) => {
        updatedFormFields[index] = {
          ...updatedFormFields[index],
          item: itemRes.data.data.name,
          qty: itemRes.data.data.sample_quantity,
          rate: itemRes.data.data.standard_rate,
          amount:
            itemRes.data.data.sample_quantity * itemRes.data.data.standard_rate,
        };
        setRowFormFields(updatedFormFields);
      });
    } else if (field.id === "qty" || field.id === "rate") {
      updatedFormFields[index] = {
        ...updatedFormFields[index],
        [field.id]: val,

        amount:
          field.id === "qty"
            ? val * updatedFormFields[index]["rate"]
            : updatedFormFields[index]["qty"] * val,
      };

      field.id === "qty"
        ? setTotalQuantity((prev) => {
            +prev + +val;
          })
        : setTotalAmount((prev) => {
            +prev + +val;
          });
      setRowFormFields(updatedFormFields);
    } else {
      updatedFormFields[index] = {
        ...updatedFormFields[index],
        [field.id]: val,
      };
      setRowFormFields(updatedFormFields);
    }
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell width={500}>item</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Rate (KWD)</TableCell>
            <TableCell>Amount (KWD)</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowFormFields.map(
            (
              row, // Replace with your row data,
              rowIndex
            ) => (
              <TableRow key={rowIndex}>
                {rowForm.map((field, index) => {
                  return (
                    <TableCell key={`${rowIndex}_${index}`} width={300}>
                      <Input
                        id={field.id}
                        label={field.label}
                        className="w-full rounded-2xl"
                        disabled={field.disabled}
                        type={field.type}
                        required={field.required}
                        value={
                          field.id === "no"
                            ? `${rowIndex + 1}`
                            : rowFormFields[rowIndex][field.id]
                        }
                        setValue={(val) => {
                          handleInputChange(val, field, rowIndex);
                        }}
                        endpoint={field.endpoint}
                        variant="standard"
                      />
                    </TableCell>
                  );
                })}
                <TableCell>
                  <div onClick={() => removeField(rowIndex)}>
                    <DeleteOutlineIcon
                      color="error"
                      className="cursor-pointer"
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>

      <Button variant="contained" onClick={handleAddRow}>
        Add Row
      </Button>

      {/* <Button variant="contained" onClick={handleDownload}>
                Download
            </Button>

            <Button variant="contained" onClick={handleSelectAll}>
                Select All
            </Button>

            <Button variant="contained" onClick={handleRemoveAll}>
                Deselect All
            </Button> */}
    </div>
  );
};

export default BillTable;
