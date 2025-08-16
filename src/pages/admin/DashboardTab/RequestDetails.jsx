import React, { useState } from 'react';
import { FiUser, FiPhone, FiMapPin, FiCalendar, FiTruck, FiHome } from 'react-icons/fi';
import AssignEngineer from './AssignEngineer';
import { motion, AnimatePresence } from 'framer-motion';

export default function RequestDetails({ open, onClose, request, onAssign }) {
  const [step, setStep] = useState(1);

  if (!open || !request) return null;

  const sections = [
    {
      title: 'Customer Info',
      fields: [
        { label: 'Name', value: request.customerName, icon: <FiUser /> },
        { label: 'Phone', value: request.customerMobile, icon: <FiPhone /> },
        { label: 'Location', value: request.location, icon: <FiMapPin /> },
        { label: 'Booking ID', value: request.bookingId || request._id, icon: <FiUser /> },
        { label: 'Date/Time', value: request.date || request.createdAt, icon: <FiCalendar /> },
      ],
    },
    {
      title: 'Vehicle Info',
      fields: [
        { label: 'Brand', value: request.brand, icon: <FiTruck /> },
        { label: 'Model', value: request.model, icon: <FiTruck /> },
        { label: 'Variant', value: request.variant, icon: <FiTruck /> },
      ],
    },
    {
      title: 'Dealer Info',
      fields: [
        { label: 'Address', value: request.dealerAddress || request.address, icon: <FiHome /> },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="request-details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {sections.map((section, idx) => (
                    <div key={idx} className="mb-4">
                      <h3 className="text-green-700 font-bold mb-2">{section.title}</h3>
                      {section.fields.map(
                        (field, i) =>
                          field.value && (
                            <div
                              key={i}
                              className="flex items-center gap-2 bg-green-50 p-2 rounded-md mb-1"
                            >
                              <div className="text-green-700">{field.icon}</div>
                              <span className="text-green-700 text-sm">
                                <strong>{field.label}:</strong> {field.value}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  ))}

                  {/* Assigned Engineer */}
                  {request.engineer_id && (
                    <div className="flex flex-col gap-2 p-3 border border-green-200 rounded-md bg-green-50">
                      <h3 className="text-green-700 font-bold">Assigned Engineer</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                          {request.engineer_name.charAt(0)}
                        </div>
                        <div className="flex flex-col text-green-700 text-sm">
                          <span className="font-bold">{request.engineer_name}</span>
                          <div className="flex items-center gap-1">
                            <FiPhone /> {request.engineer_mobile}
                          </div>
                          <div className="flex items-center gap-1">
                            <FiMapPin /> {request.engineer_location}
                          </div>
                          <div>
                            <strong>Slot:</strong> {request.engineer_assignedSlot}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 rounded bg-green-100 text-green-700 font-bold"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-green-700 text-white font-bold"
                      onClick={() => setStep(2)}
                    >
                      Assign Engineer
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="assign-engineer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <AssignEngineer
                    request={request}
                    onAssign={onAssign}
                    onBack={() => setStep(1)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
