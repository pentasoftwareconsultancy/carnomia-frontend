class ServerUrl {
    
    // Base URL
    static REACT_APP_API_URL = "http://localhost:3000/api"

    static API_MODULE_USER = "/user";
    static API_LOGIN = ServerUrl.API_MODULE_USER + "/login";
    static API_REGISTER = ServerUrl.API_MODULE_USER + "/register";
    static API_VERIFY_OTP = ServerUrl.API_MODULE_USER + "/login";
    static API_UPDATE_USER = ServerUrl.API_MODULE_USER + "/update";    
    static API_GET_ALL_USERS_BY_ROLES = ServerUrl.API_MODULE_USER + "/getUsersByRoles";  
    static API_DELETE_USER = ServerUrl.API_MODULE_USER + "/delete";

    static API_MODULE_META = "/meta";    
    static API_ADD_VEHICLE = ServerUrl.API_MODULE_META + "/Vehicle";
    static API_GET_VEHICLES = ServerUrl.API_MODULE_META + "/getallvehicle";

    static API_MODULE_COMMON = "/common";    
    static API_UPLOAD_IMAGE = ServerUrl.API_MODULE_COMMON + "/upload";

    static API_MODULE_PDI = "/pdi";
    static API_PDI_CREATE = ServerUrl.API_MODULE_PDI + "/create";
    static API_PDI_UPDATE = ServerUrl.API_MODULE_PDI + "/update";
    static API_GET_ALLPDIREQUEST = ServerUrl.API_MODULE_PDI + "/request";
    
}
export default ServerUrl;  

