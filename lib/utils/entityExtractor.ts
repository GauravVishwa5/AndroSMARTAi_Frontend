/**
 * Heuristic & Multilingual Regex Entity Extractor from Document Raw Text
 * Supports English, Marathi (मराठी), Hindi (हिंदी), and Gujarati legal documents.
 */

export interface ExtractedEntityData {
  vendor: string;
  vendee: string;
  propertyDesc: string;
  cts: string;
  surveyNo: string;
  consideration: string;
  stampDuty: string;
  regNo: string;
  sro: string;
  date: string;
  docType: string;
}

// Convert Devanagari numerals (०-९) to standard numerals (0-9)
function normalizeDevanagariDigits(str: string): string {
  const devMap: { [k: string]: string } = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  };
  return str.replace(/[०-९]/g, (d) => devMap[d] || d);
}

export function extractEntitiesFromRawText(
  rawText: string = '',
  docType: string = 'Property Deed',
  fallbackData?: any
): ExtractedEntityData {
  if (!rawText || !rawText.trim()) {
    return {
      vendor: fallbackData?.vendor || fallbackData?.advocateName || 'Grantor / Transferor',
      vendee: fallbackData?.vendee || fallbackData?.ownerName || fallbackData?.applicantName || 'Borrower / Purchaser',
      propertyDesc: fallbackData?.propertyDesc || fallbackData?.propertyName || 'Property Unit',
      cts: fallbackData?.cts || fallbackData?.ctsNumber || 'CTS-Record',
      surveyNo: fallbackData?.surveyNo || 'Survey Record',
      consideration: fallbackData?.consideration || 'Consideration Paid',
      stampDuty: 'Stamp Duty Paid as per SRO',
      regNo: fallbackData?.regNo || 'Doc #/Book-I',
      sro: fallbackData?.sro || 'Sub-Registrar Office',
      date: fallbackData?.date || 'Registered Date',
      docType: docType,
    };
  }

  const normalized = normalizeDevanagariDigits(rawText.replace(/\r/g, ''));

  // 1. Extract Borrower / Vendee / Purchaser / Member / Beneficiary
  let vendee = '';
  const vendeeMatch =
    normalized.match(/(?:Borrower|Purchaser|Vendee|Buyer|In favor of|Mortgagor|Member|Allottee)\s*[:\-–]\s*([^\n,]+(?:,\s*Residing[^\n]+)?)/i) ||
    normalized.match(/(?:खरेदीदार|घेणार|सभासद|सदस्य|अर्जदार|हितधारक)\s*[:\-–]?\s*([^\n,\.]+)/i) ||
    normalized.match(/(?:प्रमाणित करण्यात येत आहे की|certify that)\s*[,:\-–]?\s*([A-Za-z0-9\s\[\]\(\)]+?)(?:,|\s+यांस|\s+residing|\n)/i) ||
    normalized.match(/(?:Mr\.|Mrs\.|Ms\.|Shri|Smt\.|श्री|श्रीमती)\s+([A-Za-z\u0900-\u097F\s]+?)(?:,|\s+residing|\s+son of|\s+daughter of|\s+wife of|\n)/i);
  if (vendeeMatch) {
    vendee = vendeeMatch[1].trim().replace(/,\s*Residing.*$/i, '').replace(/\[.*?\]/g, '').trim();
  }

  // 2. Extract Lender / Vendor / Seller / Society / Issuing Authority
  let vendor = '';
  const vendorMatch =
    normalized.match(/(?:Lender|Vendor|Seller|Transferor|Mortgagee|Bank|Financial Institution|Issuing Authority)\s*[:\-–]\s*([^\n,]+(?:,\s*[^\n]+Branch)?)/i) ||
    normalized.match(/(?:संस्था|गृहनिर्माण संस्था|सोसायटी|प्राधिकरण|विक्रेता|देणार)\s*[:\-–]?\s*([A-Za-z\u0900-\u097F0-9\s]+(?:संस्था|Society|Bank|Branch|Pvt Ltd|Developers))/i) ||
    normalized.match(/([A-Za-z0-9\u0900-\u097F\s]+(?:गृहनिर्माण|Housing|Society)[^\n,]*)/i) ||
    normalized.match(/Between\s+([^,\n]+)/i);
  if (vendorMatch) {
    vendor = vendorMatch[1].trim();
  }

  // 3. Extract Property Description
  let propertyDesc = '';
  const propMatch =
    normalized.match(/(?:Property Description|Schedule of Property|Property Address|Description of Property|All that piece and parcel of)\s*[:\-–]\s*([^\n]+)/i) ||
    normalized.match(/(Flat\s+No[^\n]+|Plot\s+No[^\n]+|Unit\s+No[^\n]+)/i) ||
    normalized.match(/(?:सदनिका क्रमांक|फ्लॅट क्र|प्लॉट क्र|जागा)\s*[:\-–]?\s*([^\n]+)/i);
  if (propMatch) {
    propertyDesc = propMatch[1].trim();
  } else {
    // If society or land record, build from village and numbers
    const maujeMatch = normalized.match(/मौजे\s+([A-Za-z0-9\u0900-\u097F\s]+?)(?:,|\n|;)/i);
    const ctsCheck = normalized.match(/(?:नगर भूमापन क्रमांक|CTS\s*No\.?|न\.भू\.क्र\.)\s*[:\-–]?\s*([#0-9A-Za-z\s,ते\-]+)/i);
    if (maujeMatch || ctsCheck) {
      propertyDesc = `Property at Mauje ${maujeMatch ? maujeMatch[1].trim() : 'Local Area'}, ${ctsCheck ? `CTS ${ctsCheck[1].trim()}` : ''}`;
    }
  }

  // 4. Extract CTS / City Survey Number
  let cts = '';
  const ctsMatch =
    normalized.match(/(?:नगर भूमापन क्रमांक|City Survey No\.?|CTS\s+No\.?|CTS\s+Number|CTS#?|न\.भू\.क्र\.)\s*[:\-–]?\s*([A-Za-z0-9#\/\-_\sते,]+?)(?:,|\n|;|\.|$)/i);
  if (ctsMatch) {
    cts = `CTS ${ctsMatch[1].trim()}`;
  }

  // Extract Survey / Gat Number
  let surveyNo = '';
  const surveyMatch =
    normalized.match(/(?:Survey\s+No\.?|Khasra\s+No\.?|Gat\s+No\.?|सर्व्हे नंबर|सर्व्हे क्र\.?|गट नंबर|गट क्र\.?)\s*[:\-–]?\s*([A-Za-z0-9\/\-_]+)/i);
  if (surveyMatch) {
    surveyNo = `Survey No ${surveyMatch[1].trim()}`;
  }

  // 5. Extract Loan Amount / Consideration / Valuation
  let consideration = '';
  const considerMatch =
    normalized.match(/(?:Loan Amount|Consideration Amount|Consideration|Total Price|Facility Amount|मोबदला|रक्कम|मूल्यांकन)\s*[:\-–]?\s*([^\n]+)/i) ||
    normalized.match(/(?:Rs\.?|रु\.?|INR)\s*([\d,]+(?:\/\-)?(?:\s*\([^\)]+\))?)/i);
  if (considerMatch) {
    consideration = considerMatch[1].trim();
  }

  // 6. Extract Registration Number / Act
  let regNo = '';
  const regMatch =
    normalized.match(/(?:Registration\s+No\.?|Reg\s+No\.?|Document\s+No\.?|Doc\s+#?|नोंदणी क्रमांक|दस्त क्रमांक|अधिनियम क्रमांक)\s*[:\-–]?\s*([^\n,]+)/i) ||
    normalized.match(/(?:Doc|Registration)\s+#?\s*([0-9\/\-_]+)/i) ||
    normalized.match(/(?:कलम\s*[0-9\(\)\s]+अन्वये|Act\s*[0-9\/\-_]+)/i);
  if (regMatch) {
    regNo = regMatch[1].trim();
  }

  // 7. Extract Execution / Registration Date
  let date = '';
  const dateMatch =
    normalized.match(/(?:दिनांक|तारीख|dated|date of execution|registered on|made on|on this)\s*[:\-–>\s]*([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+[0-9]{4}|[0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4})/i) ||
    normalized.match(/([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{4})/i);
  if (dateMatch) {
    date = dateMatch[1].trim();
  }

  // 8. Extract SRO Sub-Registrar Office / Authority
  let sro = '';
  const sroMatch =
    normalized.match(/(?:Sub-Registrar Office|Sub-Registrar|SRO|Office of the Sub Registrar|दुय्यम निबंधक|सहाय्यक निबंधक|निबंधक कार्यालय)\s*[:\-–]?\s*([^\n,\.]+)/i) ||
    normalized.match(/(SRO\s+[A-Za-z0-9\-\s]+)/i);
  if (sroMatch) {
    sro = sroMatch[1].trim();
  }

  return {
    vendor: vendor || fallbackData?.vendor || 'Issuing Authority / Vendor',
    vendee: vendee || fallbackData?.vendee || fallbackData?.ownerName || fallbackData?.applicantName || 'Member / Applicant',
    propertyDesc: propertyDesc || fallbackData?.propertyDesc || fallbackData?.propertyName || 'Schedule Property',
    cts: cts || (fallbackData?.cts ? `CTS ${fallbackData.cts}` : 'CTS Not Mentioned'),
    surveyNo: surveyNo || fallbackData?.surveyNo || '',
    consideration: consideration || fallbackData?.consideration || 'Statutory / NOC Consideration',
    stampDuty: 'Stamp Duty & Registration Fee Paid',
    regNo: regNo || fallbackData?.regNo || 'DOC #RECORD',
    sro: sro || fallbackData?.sro || 'Competent Registrar Authority',
    date: date || fallbackData?.date || '31-Aug-2026',
    docType: docType,
  };
}
