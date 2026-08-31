interface ClaimFormData {
  scheme: "pmfby" | "ah" | "state";
  farmerName: string;
  landRecord: string;
  district: string;
  disease: string;
  confidence: number;
  area: string;
  language: "en" | "hi";
  date: Date;
  weatherInfo: string;
  requiredDocs: Array<{
    label: string;
    hi: string;
  }>;
  claimSummary: string;
  attachedFiles: number;
  schemeEligibility: string;
}

export async function generateClaimFormPDF(data: ClaimFormData): Promise<void> {
  // Dynamically import jsPDF at runtime to avoid module resolution issues
  // @ts-ignore - jsPDF will be available after npm install
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // Set colors for headers
  const primaryColor = [41, 120, 85]; // Green
  const secondaryColor = [100, 100, 100]; // Gray
  const lineColor = [200, 200, 200]; // Light gray

  // Title and Header
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, pageWidth, 30, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont(undefined, "bold");
  const titleText =
    data.language === "en"
      ? "Insurance & Government Scheme Claim Form"
      : "बीमा व सरकारी योजना दावा दस्तावेज़";
  pdf.text(titleText, pageWidth / 2, 18, { align: "center" });

  yPosition = 45;
  pdf.setTextColor(0, 0, 0);

  // Scheme Info Box
  pdf.setFillColor(240, 240, 240);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 25, "F");
  pdf.setFontSize(10);
  pdf.setFont(undefined, "bold");
  const schemeLabel = data.language === "en" ? "Scheme:" : "योजना:";
  pdf.text(`${schemeLabel} ${data.scheme.toUpperCase()}`, 20, yPosition + 3);

  const dateLabel = data.language === "en" ? "Date:" : "दिनांक:";
  pdf.setFont(undefined, "normal");
  pdf.text(
    `${dateLabel} ${data.date.toLocaleDateString(data.language === "en" ? "en-IN" : "hi-IN")}`,
    20,
    yPosition + 12
  );

  yPosition += 35;

  // Farmer Information Section
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  const farmerSectionTitle = data.language === "en" ? "Farmer Information" : "किसान जानकारी";
  pdf.text(farmerSectionTitle, 15, yPosition);

  yPosition += 10;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont(undefined, "normal");
  pdf.setFontSize(10);

  const nameLabel = data.language === "en" ? "Farmer Name:" : "किसान का नाम:";
  pdf.text(`${nameLabel} ${data.farmerName}`, 20, yPosition);
  yPosition += 7;

  const landLabel = data.language === "en" ? "Land Record (Khata):" : "खसरा संख्या:";
  pdf.text(`${landLabel} ${data.landRecord}`, 20, yPosition);
  yPosition += 7;

  const areaLabel = data.language === "en" ? "Area:" : "क्षेत्र:";
  pdf.text(`${areaLabel} ${data.area} hectare`, 20, yPosition);
  yPosition += 7;

  const districtLabel = data.language === "en" ? "District:" : "जिला:";
  pdf.text(`${districtLabel} ${data.district}`, 20, yPosition);

  yPosition += 15;

  // Disease & Diagnosis Section
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  const diagnosisSectionTitle =
    data.language === "en" ? "AI Diagnosis & Evidence" : "एआई निदान व प्रमाण";
  pdf.text(diagnosisSectionTitle, 15, yPosition);

  yPosition += 10;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont(undefined, "normal");
  pdf.setFontSize(10);

  const diseaseLabel = data.language === "en" ? "Disease/Issue:" : "रोग/समस्या:";
  pdf.text(`${diseaseLabel} ${data.disease}`, 20, yPosition);
  yPosition += 7;

  const confidenceLabel = data.language === "en" ? "Confidence:" : "विश्वास स्तर:";
  pdf.text(`${confidenceLabel} ${Math.round(data.confidence * 100)}%`, 20, yPosition);
  yPosition += 7;

  const weatherLabel = data.language === "en" ? "Weather Condition:" : "मौसम:";
  pdf.text(`${weatherLabel} ${data.weatherInfo}`, 20, yPosition);

  yPosition += 15;

  // Required Documents Section
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  const documentsTitle = data.language === "en" ? "Required Documents" : "आवश्यक दस्तावेज़";
  pdf.text(documentsTitle, 15, yPosition);

  yPosition += 8;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont(undefined, "normal");
  pdf.setFontSize(9);

  const docLabel = data.language === "en" ? "Please keep these documents ready:" : "कृपया ये दस्तावेज़ तैयार रखें:";
  pdf.text(docLabel, 20, yPosition);
  yPosition += 6;

  data.requiredDocs.forEach((doc, index) => {
    const text = data.language === "en" ? doc.label : doc.hi;
    const wrappedText = pdf.splitTextToSize(`${index + 1}. ${text}`, pageWidth - 40);
    pdf.text(wrappedText, 25, yPosition);
    yPosition += wrappedText.length * 4 + 2;

    // Add page if content exceeds page height
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  });

  yPosition += 5;

  // Claim Summary Section
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  const summaryTitle = data.language === "en" ? "Claim Summary" : "दावा सारांश";
  pdf.text(summaryTitle, 15, yPosition);

  yPosition += 8;
  pdf.setFont(undefined, "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);

  pdf.setFillColor(250, 250, 250);
  const summaryWrapped = pdf.splitTextToSize(data.claimSummary, pageWidth - 40);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 30, "F");
  pdf.text(summaryWrapped, 20, yPosition);
  yPosition += summaryWrapped.length * 5 + 10;

  // Attached Files Section
  yPosition += 5;
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const filesLabel = data.language === "en" ? "Attached Supporting Files:" : "संलग्न समर्थन फ़ाइलें:";
  pdf.text(`${filesLabel} ${data.attachedFiles}`, 20, yPosition);

  yPosition += 8;
  pdf.setFont(undefined, "normal");
  pdf.setFontSize(9);
  const fileNote =
    data.language === "en"
      ? "• Geo-tagged crop/livestock photo\n• AI diagnosis report\n• Weather records"
      : "• जियो-टैग फ़सल/पशु फोटो\n• एआई निदान रिपोर्ट\n• मौसम रिकॉर्ड";
  pdf.text(fileNote, 25, yPosition);

  // Eligibility Section
  yPosition += 20;
  pdf.setFillColor(245, 245, 245);
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 20, "F");
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  const eligibilityLabel = data.language === "en" ? "Eligibility Status:" : "पात्रता स्थिति:";
  pdf.text(eligibilityLabel, 20, yPosition + 2);

  pdf.setFont(undefined, "normal");
  pdf.setTextColor(0, 0, 0);
  pdf.text(data.schemeEligibility, 20, yPosition + 10);

  // Footer
  yPosition = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const footerText =
    data.language === "en"
      ? "This is an auto-generated claim form. Please submit with all required documents at your nearest agricultural office."
      : "यह एक स्वचालित दावा दस्तावेज़ है। कृपया सभी आवश्यक दस्तावेज़ों के साथ अपने निकटतम कृषि कार्यालय में जमा करें।";
  const footerWrapped = pdf.splitTextToSize(footerText, pageWidth - 30);
  pdf.text(footerWrapped, pageWidth / 2, yPosition, { align: "center" });

  // Download the PDF
  const fileName = `Claim_${data.farmerName.replace(/\s+/g, "_")}_${new Date().getTime()}.pdf`;
  pdf.save(fileName);
}
