import React, { useRef } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"] as const;

interface LocationPickerProps {
  label?: string;
  placeholder?: string;
  onChange?: (address: string, lat: number, lng: number) => void;
}

export default function LocationPicker({
  label,
  placeholder = "Enter your address",
  onChange,
}: LocationPickerProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBrNjsUsrJ0Mmjhe-WUKDKVaIsMkZ8iQ4A", // replace with your actual API key
    libraries: libraries as any,
  });

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const address = place.formatted_address || "";
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      if (onChange) {
        onChange(address, lat, lng);
      }
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-gray-500">
        {label}
      </label>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder={placeholder}
          className="border-2 border-primary h-14 p-3 rounded-md  w-full focus:outline-none focus:none focus:none"
        />
      </Autocomplete>
    </div>
  );
}
