import axios from 'axios';
import ApiInterceptor from './interceptor.service';

class ApiService {
  apiget(url) {
    return ApiInterceptor.init().get(`${url}`);
  }

  apipost(url, body) {
    return ApiInterceptor.init().post(`${url}`, body);
  }

  apiput(url, body) {
    return ApiInterceptor.init().put(`${url}`, body);
  }
  apipatch(url, body) {
    return ApiInterceptor.init().patch(`${url}`, body);
  }

  apidelete(url) {
    return ApiInterceptor.init().delete(`${url}`);
  }

async fetchImageAsBase64(url) {
  try {
    const response = await fetch(url, { mode: 'cors' }); // requires CORS enabled on server
    if (!response.ok) throw new Error('Failed to fetch image');

    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Failed to convert image to Base64:", err);
    return null;
  }
}


   apipostForm(url, formData) {
    return ApiInterceptor.init().post(`${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default ApiService;
