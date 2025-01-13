"use client";

import { GetFormWithSubmissions } from "@/actions/forms";
import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { useParams } from "next/navigation";
import {
  ElementsType,
  FormElementInstance,
} from "@/components/ui-components/FormElements";
import { Button } from "@/components/ui/button";
import {  SheetIcon } from "lucide-react";
import jsPDF from 'jspdf';
import { FaFileDownload } from "react-icons/fa";
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

      const columns: Record<string, string> = {};
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
      const sheetHeadsAndRows: Record<string, string>[] = [];
      form.FormSubmissions.forEach((submission) => {
        const content = JSON.parse(submission.content);
        const result: Record<string, string> = {};
        for (const key in columns) {
          if (content[key]) {
            result[columns[key]] = content[key].toUpperCase();
          }
        }
        result["submittedAt"] = String(submission.createdAt);
        sheetHeadsAndRows.push(result);

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
        XLSX.writeFile(workbook, `${form.name}.xlsx`);
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
      <SheetIcon className="w-4 h-4" />
    </Button>
  );
};

export default ExportButton;
export const ToPDF = ({
  title,
  columns,
  row,
  date,
}: {
  title: string;
  columns: {
    id: string;
    label: string;
    required: boolean;
    type: string; // Replace with your actual type
  }[];
  row: Record<string, string>;
  date: Date;
}) => {
  const generateAndDownloadPdf = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10; // Left and right margin
      const contentWidth = pageWidth - margin * 2;

      // Add a styled title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(40, 116, 240); // Stylish blue color
      pdf.text(title, pageWidth / 2, 20, { align: 'center' });

      // Add a submission date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100);
      pdf.text(`Submitted at: ${date.toLocaleString()}`, margin, 30);

      // Divider line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 35, pageWidth - margin, 35);

      // Add questions and answers
      let y = 45;
      columns.forEach((column, index) => {
        const question = `Q${index + 1}: ${column.label}`;
        const answer = `A: ${row[column.id] || 'Not answered'}`;

        // Wrap text for long questions
        const wrappedQuestion = pdf.splitTextToSize(question, contentWidth);

        // Add a background for the question
        pdf.setFillColor(240, 240, 240); // Light gray
        const questionHeight = wrappedQuestion.length * 6; // Estimate height based on line count
        pdf.rect(margin, y - 5, contentWidth, questionHeight + 5, 'F');

        // Question styling
        pdf.setFontSize(12);
        pdf.setTextColor(0);
        pdf.setFont('helvetica', 'bold');
        pdf.text(wrappedQuestion, margin + 2, y);

        y += questionHeight + 5;

        // Wrap text for the answer (if needed)
        const wrappedAnswer = pdf.splitTextToSize(answer, contentWidth);

        // Answer styling
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(50);
        pdf.text(wrappedAnswer, margin + 2, y);

        y += wrappedAnswer.length * 6 + 5; // Add spacing for the next question

        // Page break if near the bottom of the page
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
      });

      // Save the PDF
      pdf.save(`${title}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Button
      onClick={generateAndDownloadPdf}
      variant="default"
      color="primary"
      className="bg-transparent w-fit bg-primary text-sm"
    >
     Export to PDF
    <FaFileDownload/> 
    </Button>
  );
};