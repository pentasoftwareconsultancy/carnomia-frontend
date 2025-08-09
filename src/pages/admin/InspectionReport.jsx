import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { FiEye, FiEdit2, FiCheckCircle, FiSend, FiDownload, FiX } from 'react-icons/fi';

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  approved: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  sent: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
};

const InspectionReport = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      bookingId: "DSS001",
      customerName: "Onkar Basawane",
      engineerName: "Engineer A",
      date: "2025-07-10",
      status: "pending",
      reportUrl: "/reports/dss001.pdf",
      findings: [
        { id: 1, category: "Exterior", issue: "Minor scratch on rear bumper", severity: "low" },
        { id: 2, category: "Interior", issue: "AC not cooling properly", severity: "medium" }
      ],
      recommendations: "Replace AC compressor, polish scratch",
      adminNotes: "",
      rejectionReason: "",
      vehicleDetails: { brand: "Hyundai", model: "i20", variant: "Sportz", year: "2022" }
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [modifiedReport, setModifiedReport] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const modalRef = useRef(null);
  const rejectModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDialog && modalRef.current && !modalRef.current.contains(e.target)) setOpenDialog(false);
      if (showRejectDialog && rejectModalRef.current && !rejectModalRef.current.contains(e.target)) setShowRejectDialog(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDialog, showRejectDialog]);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setModifiedReport({ ...report });
    setOpenDialog(true);
    setEditing(false);
  };

  const handleEditToggle = () => setEditing(!editing);

  const handleFieldChange = (field, value) => {
    setModifiedReport(prev => ({ ...prev, [field]: value }));
  };

  const handleFindingChange = (id, field, value) => {
    setModifiedReport(prev => ({
      ...prev,
      findings: prev.findings.map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  const handleApprove = () => {
    if (!modifiedReport.adminNotes.trim()) {
      alert("Please add approval notes before approving");
      return;
    }
    setReports(reports.map(r => r.id === modifiedReport.id ? { ...modifiedReport, status: "approved" } : r));
    setModifiedReport(prev => ({ ...prev, status: "approved" }));
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    setReports(reports.map(r => r.id === modifiedReport.id ? { ...modifiedReport, status: "rejected", rejectionReason } : r));
    setShowRejectDialog(false);
    setOpenDialog(false);
    setRejectionReason("");
  };

  const handleSendToCustomer = () => {
    setReports(reports.map(r => r.id === modifiedReport.id ? { ...modifiedReport, status: "sent" } : r));
    setOpenDialog(false);
  };

  const handleSaveChanges = () => {
    setReports(reports.map(r => r.id === modifiedReport.id ? modifiedReport : r));
    setEditing(false);
  };

  const generatePdfReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18).setTextColor(40).text('DEEP SIGHT STUDIO', 105, 15, { align: 'center' });
    doc.setFontSize(16).text('VEHICLE INSPECTION REPORT', 105, 22, { align: 'center' });
    doc.setDrawColor(200).line(15, 25, 195, 25);
    doc.setFontSize(12)
      .text(`Booking ID: ${modifiedReport.bookingId}`, 20, 35)
      .text(`Customer: ${modifiedReport.customerName}`, 20, 42)
      .text(`Inspection Date: ${modifiedReport.date}`, 20, 49)
      .text(`Engineer: ${modifiedReport.engineerName}`, 20, 56)
      .text(`Status: ${modifiedReport.status.toUpperCase()}`, 20, 63);
    doc.setFontSize(14).text('VEHICLE DETAILS', 20, 75);
    doc.setFontSize(12)
      .text(`Brand: ${modifiedReport.vehicleDetails.brand}`, 20, 82)
      .text(`Model: ${modifiedReport.vehicleDetails.model}`, 20, 89)
      .text(`Variant: ${modifiedReport.vehicleDetails.variant}`, 20, 96)
      .text(`Year: ${modifiedReport.vehicleDetails.year}`, 20, 103);
    doc.setFontSize(14).text('INSPECTION FINDINGS', 20, 115);
    let yPosition = 122;
    modifiedReport.findings.forEach((f, i) => {
      doc.setFontSize(12).text(`${i + 1}. ${f.category.toUpperCase()}: ${f.issue}`, 25, yPosition);
      doc.text(`Severity: ${f.severity.toUpperCase()}`, 30, yPosition + 7);
      yPosition += 15;
      if (yPosition > 270) { doc.addPage(); yPosition = 20; }
    });
    doc.setFontSize(14).text('RECOMMENDATIONS', 20, yPosition + 10);
    doc.setFontSize(12).text(doc.splitTextToSize(modifiedReport.recommendations, 170), 25, yPosition + 17);
    doc.setFontSize(14).text('ADMIN NOTES', 20, yPosition + 30);
    doc.setFontSize(12).text(modifiedReport.adminNotes || 'N/A', 25, yPosition + 37);
    if (modifiedReport.status === 'rejected') {
      doc.setFontSize(14).text('REJECTION REASON', 20, yPosition + 50);
      doc.setFontSize(12).text(doc.splitTextToSize(modifiedReport.rejectionReason, 170), 25, yPosition + 57);
    }
    doc.setFontSize(10).setTextColor(150).text('Report generated on: ' + new Date().toLocaleString(), 105, 285, { align: 'center' });
    doc.save(`inspection_report_${modifiedReport.bookingId}.pdf`);
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
      <h1 className="text-xl sm:text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
        <span className="p-2 bg-green-100 rounded-full"><FiEye size={20} className="text-green-700" /></span>
        Inspection Reports Management
      </h1>
      <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-green-50">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-green-900">Booking ID</th>
                  <th className="p-3 text-left text-sm font-semibold text-green-900">Customer</th>
                  <th className="p-3 text-left text-sm font-semibold text-green-900">Vehicle</th>
                  <th className="p-3 text-left text-sm font-semibold text-green-900">Status</th>
                  <th className="p-3 text-left text-sm font-semibold text-green-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700">{r.bookingId}</td>
                    <td className="p-3 text-sm flex items-center gap-2">
                      <span className="w-8 h-8 bg-green-200 text-green-800 font-semibold rounded-full flex items-center justify-center">
                        {r.customerName.charAt(0).toUpperCase()}
                      </span>
                      {r.customerName}
                    </td>
                    <td className="p-3 text-sm text-gray-700">{r.vehicleDetails.brand} {r.vehicleDetails.model}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[r.status].bg} ${statusColors[r.status].text} ${statusColors[r.status].border} border`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button onClick={() => handleViewReport(r)} className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50">
                        <FiEye size={16} /> Review
                      </button>
                      <button onClick={generatePdfReport} className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 border border-green-300 rounded-md hover:bg-green-50">
                        <FiDownload size={16} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 ${openDialog ? 'block' : 'hidden'}`}>
        <div ref={modalRef} className="bg-white rounded-2xl w-full max-w-[90vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-green-100 p-4 sm:p-5 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-green-900">
              {editing ? "Edit" : "Review"} Inspection Report: {selectedReport?.bookingId}
            </h2>
            <button onClick={() => setOpenDialog(false)} className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-green-200">
              <FiX size={20} />
            </button>
          </div>
          <div className="p-4 sm:p-6 space-y-6 bg-white">
            {modifiedReport && (
              <>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-3">Vehicle Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div>
                      <p><strong className="text-green-800">Brand:</strong> {modifiedReport.vehicleDetails.brand}</p>
                      <p><strong className="text-green-800">Model:</strong> {modifiedReport.vehicleDetails.model}</p>
                    </div>
                    <div>
                      <p><strong className="text-green-800">Variant:</strong> {modifiedReport.vehicleDetails.variant}</p>
                      <p><strong className="text-green-800">Year:</strong> {modifiedReport.vehicleDetails.year}</p>
                    </div>
                    <div>
                      <p><strong className="text-green-800">Engineer:</strong> {modifiedReport.engineerName}</p>
                      <p><strong className="text-green-800">Date:</strong> {modifiedReport.date}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-3">Inspection Findings</h3>
                  {modifiedReport.findings.map(f => (
                    <div key={f.id} className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
                      {editing ? (
                        <>
                          <select
                            value={f.category}
                            onChange={e => handleFindingChange(f.id, 'category', e.target.value)}
                            className="w-full p-2 mb-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-300"
                          >
                            {['Exterior', 'Interior', 'Mechanical', 'Electrical', 'Safety'].map(item => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={f.issue}
                            onChange={e => handleFindingChange(f.id, 'issue', e.target.value)}
                            className="w-full p-2 mb-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-300"
                            placeholder="Issue Description"
                          />
                          <select
                            value={f.severity}
                            onChange={e => handleFindingChange(f.id, 'severity', e.target.value)}
                            className="w-full p-2 mb-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-300"
                          >
                            {['low', 'medium', 'high'].map(level => (
                              <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <>
                          <p><strong className="text-green-800">Category:</strong> {f.category}</p>
                          <p><strong className="text-green-800">Issue:</strong> {f.issue}</p>
                          <p>
                            <strong className="text-green-800">Severity:</strong>
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${statusColors[f.severity]?.bg || 'bg-gray-100'} ${statusColors[f.severity]?.text || 'text-gray-700'} ${statusColors[f.severity]?.border || 'border-gray-200'} border`}>
                              {f.severity.charAt(0).toUpperCase() + f.severity.slice(1)}
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-3">Recommendations</h3>
                  {editing ? (
                    <textarea
                      rows={3}
                      value={modifiedReport.recommendations}
                      onChange={e => handleFieldChange('recommendations', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-300"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{modifiedReport.recommendations}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-3">Admin Actions</h3>
                  <textarea
                    rows={4}
                    value={modifiedReport.adminNotes}
                    onChange={e => handleFieldChange('adminNotes', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-300"
                    placeholder="Add admin notes..."
                  />
                  {modifiedReport.status === 'rejected' && (
                    <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                      <strong className="text-red-800">Rejection Reason:</strong> {modifiedReport.rejectionReason}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <button
                    onClick={generatePdfReport}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    <FiDownload size={16} /> Download Full Report
                  </button>
                  {editing ? (
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Save Changes
                    </button>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="flex items-center gap-1 px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 text-sm"
                    >
                      <FiEdit2 size={16} /> Edit Report
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-end gap-2 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <button
              onClick={() => setOpenDialog(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
            >
              Close
            </button>
            {modifiedReport?.status === 'pending' && !editing && (
              <>
                <button
                  onClick={() => setShowRejectDialog(true)}
                  className="flex items-center gap-1 px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 text-sm"
                >
                  <FiX size={16} /> Reject Report
                </button>
                <button
                  onClick={handleApprove}
                  disabled={!modifiedReport?.adminNotes.trim()}
                  className={`flex items-center gap-1 px-4 py-2 text-white rounded-md text-sm ${modifiedReport?.adminNotes.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  <FiCheckCircle size={16} /> Approve Report
                </button>
              </>
            )}
            {modifiedReport?.status === 'approved' && !editing && (
              <button
                onClick={handleSendToCustomer}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                <FiSend size={16} /> Send to Customer
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 ${showRejectDialog ? 'block' : 'hidden'}`}>
        <div ref={rejectModalRef} className="bg-white rounded-2xl p-6 w-full max-w-[90vw] sm:max-w-md max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-red-800">Reject Inspection Report</h3>
            <button onClick={() => setShowRejectDialog(false)} className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-red-100">
              <FiX size={20} />
            </button>
          </div>
          <p className="mb-3 text-gray-700 text-sm">Please provide a reason for rejecting this report:</p>
          <textarea
            autoFocus
            rows={4}
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-300"
            placeholder="Rejection Reason"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowRejectDialog(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className={`px-4 py-2 text-white rounded-md text-sm ${rejectionReason.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionReport;