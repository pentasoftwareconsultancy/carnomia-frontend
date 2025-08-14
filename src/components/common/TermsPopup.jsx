import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TermsPopup = ({ onClose, onAgree }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-primary rounded-lg px-6 pt-5 pb-4 text-left shadow-xl w-full max-w-lg sm:p-6"
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Terms & Conditions</h3>
            <div className="mt-4 text-left text-sm text-gray-600 max-h-96 overflow-y-auto">
              <p className="text-gray-900">
                Effective Date: 21/05/2025
              </p>
              <br />
              <p className="mb-4">

                Welcome to Carnomia.com. By accessing or using our website and services, you agree to the terms outlined below. Please read them carefully.

              </p>
              <h4 className="font-medium mb-2">1. Service Overview</h4>
              <p className="mb-4">Carnomia offers Pre-Delivery Inspection (PDI) services for new and used cars across selected cities in India. Our services include on-site inspections, digital reports, and consultation before a vehicle is purchased.</p>

              <h4 className="font-medium mb-2">2. Booking & Scheduling</h4>
              <p className="mb-4">• Users must provide accurate information about the vehicle, seller location, and preferred inspection time.<br />
                • Carnomia reserves the right to reschedule or cancel a booking due to unforeseen circumstances (e.g., weather, unavailability, etc.).<br />
                • On-site inspections depend on access being granted by the vehicle owner or dealership.</p>

              <h4 className="font-medium mb-2">3. Payment Terms</h4>
              <p className="mb-4">• You only pay after the inspection is complete and the digital report has been delivered.<br />
                • Payment must be made through the modes available on the platform (UPI,
                Cash etc.).<br />
                • No refund is applicable once the report is delivered unless there is a proven error in the service.</p>

              <h4 className="font-medium mb-2">4. Scope of Inspection</h4>
              <p className="mb-4">• Carnomia inspections are visual and tool-based checks. We do not dismantle or open parts of the vehicle.<br />
                • The report is advisory in nature and is not a certification of the car's legal ownership, insurance status, or registration.<br />
                • Our findings are based on the vehicle condition at the time of inspection only.
              </p><br/>

              <h4 className="font-medium mb-2">5. User Responsibilities</h4>
              <p>• You are responsible for ensuring access to the vehicle at the scheduled time.<br />
                • You must ensure the vehicle is located in a safe and accessible environment for inspection.<br />
                • Carnomia is not responsible for any delays or incomplete checks due to denied access.<br />
                • If car is not available for inspection within 30 minutes from the scheduled time then you have to paid Rs.500 visiting charges and engineer will move forward to next location.
              </p><br/>

              <h4 className="font-medium mb-2">6. Liability Disclaimer</h4>
              <p>• Carnomia is not liable for any loss, damage, or costs incurred as a result of using our inspection service or relying solely on the report.<br/>
                • We do not guarantee the future performance of the vehicle or detect faults that are intermittent or concealed at the time of inspection.
              </p><br/>

              <h4 className="font-medium mb-2">7. Intellectual Property</h4>
              <p>All content on Carnomia.com - including text, images, logos, reports, and software - is the property of Carnomia and cannot be used or reproduced without permission.
              </p><br/>

              <h4 className="font-medium mb-2">8. Changes to Terms</h4>
              <p>We may update these Terms & Conditions from time to time. Changes will be posted on this page and will take effect immediately upon posting.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={onAgree}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-400"
              >
                I Agree
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TermsPopup;