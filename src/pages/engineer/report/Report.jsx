import React, { useState, useEffect, useRef } from "react";
import car from "../../../assets/car2.jpg";
import VehicleInfo from "./VehicleInfo";
import BasicDetails from "./BasicDetails";
import ProfilePhotos from "./ProfilePhotos";
import BodyPanels from "./BodyPanels";
import Glasses from "./Glasses";
import RubberComponent from "./RubberComponent";
import SeatsFabrics from "./SeatsFabrics";
import SeatBelts from "./SeatBelts";
import PlasticPanel from "./PlasticPanel";
import FeaturesFunctions from "./FeaturesFunctions";
import LiveParameters from "./LiveParameters";
import FluidLevels from "./FluidLevels";
import Engine from "./Engine";
import Transmission from "./Transmission";
import Brakes from "./Brakes";
import DiagnosticsCodes from "./DiagnosticsCodes";
import Tyres from "./Tyres";
import { useParams } from "react-router-dom";
import ApiService from '../../../core/services/api.service';
import ServerUrl from './../../../core/constants/serverUrl.constant';
import {APPLICATION_CONSTANTS} from '../../../core/constants/app.constant';

const steps = [
  "Vehicle Info",
  "Basic Details",
  "Profile Photos",
  "Body Panels",
  "Glasses",
  "Rubber Component",
  "Seats & Fabrics",
  "Seat Belts",
  "Plastic Panels",
  "Features & Functions",
  "Live Parameters",
  "Fluid Levels",
  "Engine",
  "Transmission",
  "Brakes",
  "Diagnostics Codes",
  "Tyres",
];

const Report = () => {
  const { id } = useParams(); 
  const [photos, setPhotos] = useState({});
  const [bodyPanels, setBodyPanels] = useState({});
  const [glassPanels, setGlassPanels] = useState({});
  const [rubberPanels, setRubberPanels] = useState({});
  const [seatPanels, setSeatPanels] = useState({});
  const [seatBeltPanels, setSeatBeltPanels] = useState({});
  const [plasticPanels, setPlasticPanels] = useState({});
  const [featurePanels, setFeaturePanels] = useState({});

  const [requestDetails, setRequestDetails] = useState({});
  const [step, setStep] = useState(0);
  const [basicDetails, setBasicDetails] = useState({
    vinNumber: "",
    engineNumber: "",
    mileage: "",
    keys: "",
    dealer_pdi: false,
    vinPhoto: null,
    engineNumberPhoto: null,
    mileagePhoto: null,
  });
  const [mechanicalDetails, setMechanicalDetails] = useState([]);
  const [safetyDetails, setSafetyDetails] = useState([]);
  const [showPhoto, setShowPhoto] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const stepRefs = useRef([]);
  const [imageUrl, setImageUrl] = useState(car);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        // setLoading(true);
        const response = await new ApiService().apiget(
          `${ServerUrl.API_GET_REQUEST_BY_ID}/${id}`
        );
        console.log(response.data);
        setRequestDetails(response.data.data);
        // setError(null);
      } catch (err) {
        console.error("Error fetching request:", err);
        // setError("Failed to load request details");
      } finally {
        // setLoading(false);
      }
    };

    if (id) {
      fetchRequest();
    }
  }, [id]);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onerror = () => setImageUrl("path/to/fallback/image.jpg");
  }, [imageUrl]);

  useEffect(() => {
    if (window.innerWidth < 1024 && stepRefs.current[step]) {
      stepRefs.current[step].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [step]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 640) {
        setScrolled(window.scrollY > 50);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      updateInpectionDetails()
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    updateInpectionDetails(APPLICATION_CONSTANTS.REQUEST_STATUS.SUBMITTED)
    alert("Inspection form submitted successfully!");
  };


  const updateInpectionDetails  = async (status= null)=>{

    const payload = {
      ...photos,
      ...bodyPanels,
      ...glassPanels,
      ...rubberPanels,
      ...seatPanels,
      ...seatBeltPanels,
      ...plasticPanels,
      ...featurePanels,
    }

    if(status) {
      payload['status'] = status;
    }

    const response = await new ApiService().apiput(ServerUrl.API_GET_INSPECTION_UPDATE + '/' + requestDetails._id, payload)
    
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <VehicleInfo vehicleInfo={requestDetails ?? {}} />;
      case 1:
        return (
          <BasicDetails
            basicDetails={basicDetails}
            setBasicDetails={setBasicDetails}
            showPhoto={showPhoto}
            setShowPhoto={setShowPhoto}
          />
        );
      case 2:
        return (
          <ProfilePhotos
            photos={photos}
            setPhotos={setPhotos}
          />
        );
      case 3:
        return (
          <BodyPanels
            bodyPanels={bodyPanels}
            setBodyPanels={setBodyPanels}
          />
        );
      case 4:
        return (
          <Glasses
            glassPanels={glassPanels}
            setGlassPanels={setGlassPanels}
          />
        );
      case 5:
        return (
          <RubberComponent
            rubberPanels={rubberPanels}
            setRubberPanels={setRubberPanels}
          />
        );
      case 6:
        return (
          <SeatsFabrics
            seatPanels={seatPanels}
            setSeatPanels={setSeatPanels}
          />
        );
      case 7:
        return (
          <SeatBelts
            seatBeltPanels={seatBeltPanels}
            setSeatBeltPanels={setSeatBeltPanels}
          />
        );
      case 8:
        return (
          <PlasticPanel
            plasticPanels={plasticPanels}
            setPlasticPanels={setPlasticPanels}
          />
        );
      case 9:
        return (
          <FeaturesFunctions
            featurePanels={featurePanels}
            setFeaturePanels={setFeaturePanels}
          />
        );
      case 10:
        return (
          <LiveParameters
            vehicleInfo={requestDetails}
            basicDetails={basicDetails}
            interiorDetails={interiorDetails}
            mechanicalDetails={mechanicalDetails}
            safetyDetails={safetyDetails}
          />
        );
      case 11:
        return (
          <FluidLevels
            vehicleInfo={requestDetails}
            basicDetails={basicDetails}
            interiorDetails={interiorDetails}
            mechanicalDetails={mechanicalDetails}
            safetyDetails={safetyDetails}
          />
        );
      case 12:
        return (
          <Engine
            vehicleInfo={requestDetails}
            basicDetails={basicDetails}
            interiorDetails={interiorDetails}
            mechanicalDetails={mechanicalDetails}
            safetyDetails={safetyDetails}
          />
        );
      case 13:
        return (
          <Transmission
            vehicleInfo={requestDetails}
            basicDetails={basicDetails}
            interiorDetails={interiorDetails}
            mechanicalDetails={mechanicalDetails}
            safetyDetails={safetyDetails}
          />
        );
      case 14:
        return (
          <Brakes
            vehicleInfo={requestDetails}
            basicDetails={basicDetails}
            interiorDetails={interiorDetails}
            mechanicalDetails={mechanicalDetails}
            safetyDetails={safetyDetails}
          />
        );
      case 15:
        return (
          <DiagnosticsCodes
            vehicleInfo={requestDetails}
            basicDetails={basicDetails}
            interiorDetails={interiorDetails}
            mechanicalDetails={mechanicalDetails}
            safetyDetails={safetyDetails}
          />
        );
      case 16:
        return (
          <Tyres
            vehicleInfo={requestDetails}
            // basicDetails={basicDetails}
            // interiorDetails={interiorDetails}
            // mechanicalDetails={mechanicalDetails}
            // safetyDetails={safetyDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F1FFE0]">
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 z-0 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full flex flex-col items-center px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Pre-Delivery Inspection Form
          </h2>
        </div>

        {/* Stepper with consistent glassy bg */}
        <div className="flex overflow-x-auto whitespace-nowrap gap-1 p-1 rounded-full scrollbar-hide mb-8 w-full max-w-3xl bg-white/30 shadow-md backdrop-blur-md">
          {steps.map((label, index) => (
            <button
              key={label}
              ref={(el) => (stepRefs.current[index] = el)}
              onClick={() => setStep(index)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                step === index
                  ? "bg-gradient-to-r from-lime-300 to-green-300 text-white shadow-md"
                  : "bg-white/30 text-gray-700 hover:bg-white/40"
              }`}
              style={{ minWidth: "8rem" }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-full flex justify-center px-2">{renderStep()}</div>
        <div className="flex flex-col sm:flex-row justify-between mt-8 sm:mt-12 w-full max-w-4xl gap-4 sm:gap-0 px-2">
          {step > 0 ? (
            <button
              onClick={goBack}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all font-medium text-gray-800 shadow-md"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={goNext}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all"
          >
            {step === steps.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
