import { useEffect, useState } from "react";
import { Radio } from "@mui/material";
import "./CountrySelector.css";
import { ApiCountry } from "models/Api";

type CountrySelectorProps = {
  onSelect?: Function;
  name?: string;
  countries?: Array<ApiCountry>;
};

function CountrySelector({ onSelect, name, countries }: CountrySelectorProps) {
  const [selectedValue, setSelectedValue] = useState(1);

  const handleChange = (id: any) => {
    setSelectedValue(id);
  };

  useEffect(() => {
    if (onSelect && selectedValue) {
      onSelect({ selectedValue, name });
    }
  }, [selectedValue]);

  return (
    <div className="countries-container" data-testid="CountrySelector">
      {countries && countries?.length > 0 ? (
        <>
          {countries?.map((country) => {
            return (
              <div
                className="radio-container"
                key={country.id}
                onClick={() => handleChange(country.id)}
                id={`rad_${country.id}`}
              >
                <div className="flag-container">
                  <img src={`/flags/${country.flag}`} alt={country.name} />
                  <span className="body1" data-testid="list-countries">
                    {country.name}
                  </span>
                </div>
                <Radio
                  checked={selectedValue === country.id}
                  value={country.id}
                  name={name}
                  inputProps={{ "aria-label": country.name }}
                  className="radio"
                  data-testid="radio-test"
                />
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div className="skeleton box-shadow" style={{ maxWidth: "208px" }}>
            <div className="skeleton-left">
              <div className="circle"></div>
              <div className="line w80" style={{ marginBottom: "10px" }}></div>
            </div>
          </div>
          <div className="skeleton box-shadow" style={{ maxWidth: "208px" }}>
            <div className="skeleton-left">
              <div className="circle"></div>
              <div className="line w80" style={{ marginBottom: "10px" }}></div>
            </div>
          </div>
          <div className="skeleton box-shadow" style={{ maxWidth: "208px" }}>
            <div className="skeleton-left">
              <div className="circle"></div>
              <div className="line w80" style={{ marginBottom: "10px" }}></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CountrySelector;
