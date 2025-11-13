import React, { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import CustomInput from "../CustomInput";

interface GoogleLocationInputProps {
  value?: string;
  onChange?: (address: string, lat?: number, lng?: number) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const LocationPicker: React.FC<GoogleLocationInputProps> = ({
  value = "",
  onChange,
  label = "Enter address",
  placeholder = "",
  required = false,
}) => {
  const [address, setAddress] = useState(value);
  const [error, setError] = useState("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const formattedAddress = place.formatted_address || "";
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      setAddress(formattedAddress);
      setError(""); // clear error
      if (onChange) onChange(formattedAddress, lat, lng);
    }
  };

  const handleBlur = () => {
    if (required && !address) setError("Address is required");
    else setError("");
  };

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <CustomInput
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onBlur={handleBlur}
          label={label}
          placeholder={placeholder}
        />
      </Autocomplete>
      {error && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
