export const downloadPdf = (filepath, nomorSurat) => {
  if (!filepath || !nomorSurat) return;

  const link = document.createElement("a");
  link.href = filepath;
  link.download = `surat-${nomorSurat || "document"}.pdf`;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
