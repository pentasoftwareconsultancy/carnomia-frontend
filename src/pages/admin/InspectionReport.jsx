import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { FiEye, FiDownload } from 'react-icons/fi';
import ServerUrl from '../../core/constants/serverUrl.constant';
import ApiService from '../../core/services/api.service';
import { useNavigate } from 'react-router-dom';
import { APPLICATION_CONSTANTS } from '../../core/constants/app.constant';

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  approved: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  sent: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
};

const InspectionReport = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modifiedReport, setModifiedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const modalRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const payload = [
          APPLICATION_CONSTANTS.REQUEST_STATUS.WAITING_FOR_APPROVAL,
          APPLICATION_CONSTANTS.REQUEST_STATUS.ADMIN_APPROVED,
          APPLICATION_CONSTANTS.REQUEST_STATUS.ADMIN_REJECTED
        ];
        const res = await new ApiService().apipost(ServerUrl.API_GET_ALLPDIREQUEST_STATUSES, payload);
        setReports(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };
    fetchReports();
  }, []);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (openDialog && modalRef.current && !modalRef.current.contains(e.target)) setOpenDialog(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDialog]);

  const handleViewReport = report => {
    // setSelectedReport(report);
    // setModifiedReport({ ...report });
    // setOpenDialog(true);
    navigate(`/admin/dashboard/report/${report._id}?isAdm=true`);
  };

  const generatePdfReport = () => {
    if (!modifiedReport) return;
    const doc = new jsPDF();
    doc.setFontSize(18).text('DEEP SIGHT STUDIO', 105, 15, { align: 'center' });
    doc.setFontSize(16).text('VEHICLE INSPECTION REPORT', 105, 22, { align: 'center' });
    doc.setDrawColor(200).line(15, 25, 195, 25);
    doc.setFontSize(12)
      .text(`Booking ID: ${modifiedReport.bookingId}`, 20, 35)
      .text(`Customer: ${modifiedReport.customer?.name} / ${modifiedReport.customer?.mobile}`, 20, 42)
      .text(`Engineer: ${modifiedReport.engineer?.name} / ${modifiedReport.engineer?.mobile}`, 20, 49)
      .text(`Date / Time: ${modifiedReport.date} ${modifiedReport.time || ''}`, 20, 56)
      .text(`Status: ${modifiedReport.status.toUpperCase()}`, 20, 63)
      .text(`Vehicle: ${modifiedReport.vehicle?.brand} ${modifiedReport.vehicle?.model} (${modifiedReport.vehicle?.variant})`, 20, 70)
      .text(`Year: ${modifiedReport.vehicle?.year}`, 20, 77);

    doc.setFontSize(14).text('INSPECTION FINDINGS', 20, 90);
    let yPos = 97;
    (modifiedReport.findings || []).forEach((f, i) => {
      doc.setFontSize(12).text(`${i + 1}. ${f.category}: ${f.issue}`, 25, yPos);
      doc.text(`Severity: ${f.severity}`, 30, yPos + 7);
      yPos += 15;
      if (yPos > 270) { doc.addPage(); yPos = 20; }
    });

    doc.setFontSize(14).text('RECOMMENDATIONS', 20, yPos + 10);
    doc.setFontSize(12).text(doc.splitTextToSize(modifiedReport.recommendations || '', 170), 25, yPos + 17);

    doc.setFontSize(14).text('ADMIN NOTES', 20, yPos + 30);
    doc.setFontSize(12).text(modifiedReport.adminNotes || 'N/A', 25, yPos + 37);

    if (modifiedReport.status === 'rejected') {
      doc.setFontSize(14).text('REJECTION REASON', 20, yPos + 50);
      doc.setFontSize(12).text(doc.splitTextToSize(modifiedReport.rejectionReason || '', 170), 25, yPos + 57);
    }

    doc.setFontSize(10).text('Report generated on: ' + new Date().toLocaleString(), 105, 285, { align: 'center' });
    doc.save(`inspection_report_${modifiedReport.bookingId}.pdf`);
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
      <h1 className="text-xl sm:text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
        <span className="p-2 bg-green-100 rounded-full"><FiEye size={20} className="text-green-700" /></span>
        Inspection Reports Management
      </h1>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-green-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-green-900">Booking ID</th>
                <th className="p-3 text-left text-sm font-semibold text-green-900">Customer Name</th>
                <th className="p-3 text-left text-sm font-semibold text-green-900">Engineer Name</th>
                <th className="p-3 text-left text-sm font-semibold text-green-900">Brand Modal</th>
                <th className="p-3 text-left text-sm font-semibold text-green-900">Date / Time</th>
                <th className="p-3 text-left text-sm font-semibold text-green-900">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-green-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700">{r.bookingId}</td>
                  <td className="p-3 text-sm">
                    <div className="flex flex-col">
                      <span>{r.customer?.name}</span>
                      <span className="text-gray-500 text-xs">{`${r.customerName} ${r.customerMobile}`}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    <div className="flex flex-col">
                      <span>{r.engineer?.name}</span>
                      <span className="text-gray-500 text-xs">{r.engineer_name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">{`${r.brand} ${r.model}`}</td>
                  <td className="p-3 text-sm text-gray-700">
                    <div className="flex flex-col">
                      <span>{r.date}</span>
                      <span className="text-gray-500 text-xs">{r.time || ''}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[r.status]?.bg} ${statusColors[r.status]?.text} ${statusColors[r.status]?.border} border`}>
                      {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button onClick={() => handleViewReport(r)} className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50">
                      <FiEye size={16} /> Review
                    </button>
                    <button onClick={() => { setModifiedReport({ ...r }); generatePdfReport(); }} className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 border border-green-300 rounded-md hover:bg-green-50">
                      <FiDownload size={16} /> Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal Placeholder */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Review Report - {modifiedReport.bookingId}</h2>
            {/* Modal content goes here */}
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => setOpenDialog(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionReport;
