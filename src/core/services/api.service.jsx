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

  apidelete(url) {
    return ApiInterceptor.init().delete(`${url}`);
  }
}

export default ApiService;
