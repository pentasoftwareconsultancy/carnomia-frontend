// import ApiService from "../core/services/api.service";

// export const uploadDocument = async (documentType, file) => {
//   try {
//     const formData = new FormData();
//     formData.append("documentType", documentType);
//     formData.append("documents", file); // Ensure 'documents' matches your API


//     const response = await new ApiService().apipostForm("/common/upload", formData);
//     // return response?.data?.data;
//     // const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
//     //   headers: { "Content-Type": "multipart/form-data" },
//     // });
//     console.log("uploaded imaged" , response);
//     return response.data; // Returning API response to the caller
//   } catch (error) {
//     console.error("Upload failed:", error);
//     throw error;
//   }
// };



// export const base64ToFile = (base64String, fileName) => {
//   const arr = base64String.split(",");
//   const mime = arr[0].match(/:(.*?);/)[1];
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);

//   while (n--) u8arr[n] = bstr.charCodeAt(n);

//   return new File([u8arr], fileName, { type: mime });
// };


// file_uploader_service.jsx
// file_uploader_service.js

import ApiService from "../core/services/api.service";
import ServerUrl from "../core/constants/serverUrl.constant";


class FileUploaderService {
  constructor() {
    this.streamStates = {};
    this.videoRefs = {};
    this.isCameraActive = {};
  }

  setVideoRef(label, ref) {
    this.videoRefs[label] = ref;
  }

  async uploadFileToServer(file, label) {
    if (!file) throw new Error("No file selected");
    const formData = new FormData();
    formData.append("documents", file);
    formData.append("documentType", label);
    console.log("LABEL : ",label);
    const response = await new ApiService().apipostForm(ServerUrl.API_UPLOAD_IMAGE, formData);
    return response.data; // You can adjust depending on your API's return shape
  }

  async handleFileUpload(e, label, setPhotos, setShowDropdown) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setShowDropdown(null);
        const fileUrl = await this.uploadFileToServer(file, label); // optional: upload right after selecting
        setPhotos(prev => ({ ...prev, [label]: fileUrl.files[0].fileUrl }));

      };
      reader.readAsDataURL(file);
    } else {
      console.warn("Selected file is not an image or no file selected");
    }
  }

  async handleCameraClick(label, setStreamStates, setIsCameraActive, takePhoto) {
    if (!this.isCameraActive[label]) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStreamStates(prev => ({ ...prev, [label]: stream }));
        if (this.videoRefs[label]) {
          this.videoRefs[label].srcObject = stream;
        }
        this.streamStates[label] = stream;
        this.isCameraActive[label] = true;
        setIsCameraActive(prev => ({ ...prev, [label]: true }));
} catch (err) {
  console.error("Camera Error:", err.name, err.message);
  if (err.name === "NotAllowedError") {
    alert("Camera permission denied. Please allow it in browser settings.");
  } else if (err.name === "NotFoundError") {
    alert("No camera device found.");
  } else if (err.name === "NotReadableError") {
    alert("Camera is already in use by another app.");
  } else {
    alert(`Unexpected camera error: ${err.message}`);
  }
}

    } else {
      takePhoto(label);
    }
  }

  async takePhoto(label, setPhotos, setIsCameraActive, setShowDropdown) {
    const video = this.videoRefs[label];
    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
     
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      await this.uploadFileToServer(blob, label);
    
      const photo = canvas.toDataURL("image/png");
      setPhotos(prev => ({ ...prev, [label]: photo }));

      this.stopCamera(label);
      this.isCameraActive[label] = false;
      setIsCameraActive(prev => ({ ...prev, [label]: false }));
      setShowDropdown(null);
    } else {
      console.warn(`No video element found for label: ${label}`);
    }
  }

  stopCamera(label) {
    if (this.streamStates[label]) {
      this.streamStates[label].getTracks().forEach(track => track.stop());
      this.streamStates[label] = null;
      if (this.videoRefs[label]) {
        this.videoRefs[label].srcObject = null;
      }
    }
  }
}

export default new FileUploaderService();
