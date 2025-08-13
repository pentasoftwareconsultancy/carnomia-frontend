export const APPLICATION_CONSTANTS = {
  STORAGE: {        
    TOKEN: "token",
    USER_DETAILS: "user",
    LANGUAGE: "lang"
  },
  ALLOW_FILES_EXTENSION: "pdf,jpeg,xls",
  CONTENT_TYPES: "application/json",
  REQUEST_STATUS: {
      NEW: "NEW",                            // 1. New request created
      ASSIGNED_ENGINEER: "ASSIGNED_ENGINEER", // 2. Admin assigned engineer
      IN_PROGRESS: "IN_PROGRESS",           // 3. Engineer accepted and working
      WAITING_FOR_APPROVAL:"WAITING_FOR_APPROVAL", // 2. Waiting for admin review
      ADMIN_APPROVED: "APPROVED",      // 2. Admin approved
      ADMIN_REJECTED: "ADMIN_REJECTED",    // 2. Admin rejected
      // SUBMITTED: "SUBMITTED",               // 4. Engineer submitted PDI investigation
      ADMIN_REVIEW_REJECTED: "ADMIN_REVIEW_REJECTED", // 5. Admin rejected after review
      ADMIN_REVIEW_APPROVED: "ADMIN_REVIEW_APPROVED", // 5 & 6. Admin approved after review
      ADMIN_REVIEW_CUSTOMIZED: "ADMIN_REVIEW_CUSTOMIZED", // 5 & 6. Admin customized
      CUSTOMER_PAID: "CUSTOMER_PAID",       // 6. Customer paid
      CLOSED: "CLOSED",                     // 7. Admin approved payment, closed request
  }
};
