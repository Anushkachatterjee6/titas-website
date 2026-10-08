/**
 * Laboratory report reference data.
 * Transcribed only from the supplied test report. No additional results are
 * fabricated, and the report applies to the tested sample shown below.
 */

export const labReport = {
  laboratory: "ITS Testing Laboratory Private Limited",
  reportCode: "W-170826-90",
  issueDate: "24/08/2026",
  issuedTo: "M/S. SUJIT AQUA ENTERPRISE",
  sampleDescription: "Packaged Drinking Water Sample",
  sourceOfWater: "Borewell",
  sampleDrawnOn: "14/08/2026",
  batchNo: "Trial",
  sampleQuantity: "12 x 1 Ltr PET bottles",
  analysisDuration: "17/08/2026 to 24/08/2026",
  specification: "FSSR, 2011 Regulations 2.10.8",
  samplingProcedure: "IS:17614 (Part-1):2021",
  /** The supplied laboratory report, served locally from /public/documents. */
  pdfUrl: "/documents/titas-laboratory-report.pdf",
  disclaimer:
    "This is the laboratory test report supplied by the company. It relates to the specific sample and parameters tested, and is not a statement that every future batch returns identical results.",
};

export const labCategories = [
  {
    title: "Microbiological requirement",
    detail:
      "Escherichia coli and coliform bacteria (cfu/250 ml) tested to IS-15185:2016 Reff.2021.",
  },
  {
    title: "Organoleptic & physical parameters",
    detail:
      "Colour, odour, taste, turbidity, pH value and total dissolved solids tested to the IS-3025 series.",
  },
  {
    title: "General chemical parameters",
    detail:
      "General chemical parameters as listed in the supplied laboratory test report.",
  },
  {
    title: "Pesticide residual analysis",
    detail:
      "Pesticide residual analysis as listed in the supplied laboratory test report.",
  },
  {
    title: "Residual analysis",
    detail: "Residual analysis as listed in the supplied laboratory test report.",
  },
];

/**
 * Licences & certifications.
 * GST Registration was obtained 06/10/2026 (GST REG-06 certificate,
 * GSTIN 19AERPM6342N1ZN) — transcribed from the supplied certificate only;
 * its "Period of Validity — To" field is "Not Applicable", so no expiry
 * date is shown. FSSAI and other licences remain pending until their own
 * documentation is supplied.
 */
export type Certification = {
  name: string;
  status: "Pending" | "Obtained" | "Information awaited";
  note: string;
  issueDate?: string;
  expiryDate?: string;
  documentUrl?: string;
  /** Overrides the document button's label (defaults to "View document"). */
  documentLabel?: string;
  /** Small muted helper line shown under the document button, e.g. a
   *  signature-verification tip. Optional, rendered only when present. */
  verificationNote?: string;
};

export const certifications: Certification[] = [
  {
    name: "FSSAI Licence",
    status: "Pending",
    note: "Information will be updated as documentation is finalised.",
  },
  {
    name: "GST Registration",
    status: "Obtained",
    note: "GSTIN 19AERPM6342N1ZN · Regular registration for SUJIT AQUA ENTERPRISE (Legal name: Amit Mondal, Proprietorship).",
    issueDate: "06/10/2026",
    expiryDate: "—",
    documentUrl: "/documents/titas-gst-registration-certificate.pdf",
    documentLabel: "View Certificate",
    verificationNote: "For digital signature verification, open the certificate in Adobe Acrobat Reader.",
  },
  {
    name: "Laboratory Test Report",
    status: "Obtained",
    note: `Water sample analysis by ${labReport.laboratory}, report code ${labReport.reportCode}.`,
    issueDate: labReport.issueDate,
    documentUrl: labReport.pdfUrl,
  },
  {
    name: "Other licences & approvals",
    status: "Information awaited",
    note: "Information will be updated as documentation is finalised.",
  },
];
