import { useRef, useState, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"] as const;

interface LocationPickerProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (address: string, lat: number, lng: number) => void;
}

export default function LocationPicker({
  label,
  placeholder = "Enter your address",
  value = "",
  onChange,
}: LocationPickerProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBrNjsUsrJ0Mmjhe-WUKDKVaIsMkZ8iQ4A",
    libraries: libraries as any,
  });

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const address = place.formatted_address || "";
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setInputValue(address);

      if (onChange) onChange(address, lat, lng);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7D7D7D]">
        {label}
      </label>

      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          className="border-2 border-primary h-14 p-3 rounded-md w-full focus:outline-none"
        />
      </Autocomplete>
    </div>
  );
}
