import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./camera.css";
import { CameraOutlined } from "@ant-design/icons";
import Notification from "../../utils/notification/Notification";
function Camera() {
  const [visible, setVisible] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [notification, setNotification] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef(null);

  const handleOpenCamera = () => {
    if (capturedImages.length <= 2) {
      setVisible(true);
    } else {
      showNotification("error", "Maksimum 2 resim çekebilirsiniz!");
    }
  };

  const handleCloseCamera = () => {
    setVisible(false);
    console.log("hb");
  };
  const handleCaptureImage = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    setCapturedImages([...capturedImages, imgSrc]);
    setVisible(false);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    await Promise.all(
      capturedImages.map(async (img, key) => {
        const response = await fetch(img);
        const blob = await response.blob();
        formData.append(`image_${key}`, blob, `captured_image_${key}.jpg`);
      })
    );
    showNotification("success", "Resimler başarıyla gönderildi!");
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  const toggleFacingMode = () => {
    setFacingMode(prevMode => (prevMode === "user" ? "environment" : "user"));
  };
  return (
    <>
      <section className="cameraSection">
        <div className="cameraSectionDiv">
          <div className="cameraBigDiv">
            <button
              className="cameraOpen"
              type="button"
              onClick={handleOpenCamera}
            >
              <CameraOutlined />
            </button>
            {visible && (
              <div className="cameraModal">
                <div className="cameraDiv">
                  <button onClick={handleCloseCamera} className="cameraBtnClose">
                    Kapat
                  </button>
                  <button onClick={toggleFacingMode} className="cameraBtnBack" >
                    Arka Kamera
                  </button>
                  <Webcam ref={webcamRef} mirrored={true}   videoConstraints={{ facingMode }} className="camera" />
                  <button
                    onClick={handleCaptureImage}
                    className="cameraBtnSave"
                  ></button>
                </div>
              </div>
            )}
            <div className="capturedImagesContainer">
              {capturedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  className="capturedImage"
                  alt={`Captured ${index}`}
                />
              ))}
            </div>
          </div>
          <button type="button" onClick={handleSubmit} className="cameraSend">
            Gonder
          </button>
        </div>
      </section>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}

export default Camera;
