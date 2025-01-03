"use client";

import { GetFormWithSubmissions } from "@/actions/forms";
import React from "react";
import * as XLSX from "xlsx";
import { useParams } from "next/navigation";
import {
  ElementsType,
  FormElementInstance,
} from "@/components/ui-components/FormElements";
import { Button } from "@/components/ui/button";

const ExportButton = () => {
  const router = useParams();

  // Extract the ID from the URL
  const id = router.id; // Use `query` to get the dynamic segment
  console.log({ id });
  const TableWithExport = async () => {
    if (!id) {
      console.error("ID not found in the URL");
      return;
    }

    try {
      // Fetch the form data
      const form = await GetFormWithSubmissions(+id);

      if (!form) throw new Error(`Form not found`);

      const columns :  Record<string, string> = {};
      const FormElements = JSON.parse(form.content) as FormElementInstance[];

      FormElements.forEach((ele) => {
        switch (ele.type) {
          case "TextField":
          case "TextAreaField":
          case "CheckboxField":
          case "DateField":
          case "NumberField":
          case "SelectField":
            columns[ele.id] = ele.extraAttributes?.label;
            break;

          default:
            break;
        }
      });
      console.log({ columns });

      type Row = {
        [key: string]: string;
      } & {
        submittedAt: Date;
      };
      const rows: Row[] = [];
      const sheetHeadsAndRows : Record<string, string>[] = []
      form.FormSubmissions.forEach((submission) => {
        const content = JSON.parse(submission.content);

        const result :  Record<string, string> = {};
        for (const key in columns) {
          if (content[key]) {
            result[columns[key] ] = content[key].toUpperCase();
          }
        }
        result["submittedAt"] = String(submission.createdAt)
        sheetHeadsAndRows.push(result)



        rows.push({
          ...content,
          submittedAt: submission.createdAt,
        });
      });
      console.log({ rows });
      // Export data to Excel





      const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(sheetHeadsAndRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `form_${id}_data.xlsx`);
      };
     
      exportToExcel();
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <Button
      onClick={TableWithExport}
      style={{ padding: "10px 20px", cursor: "pointer" }}
      className=" hover:scale-105 transition-transform text-white rounded-md text-lg"
    >
      Export to Excel
    </Button>
  );
};

export default ExportButton;
