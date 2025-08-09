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

   apipostForm(url, formData) {
    return ApiInterceptor.init().post(`${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default ApiService;
