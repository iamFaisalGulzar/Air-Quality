import React, { useState } from "react";
import { Input, Button } from "semantic-ui-react";
import { capitalizeFirstLetter } from "../utils/autoCapatlize";

function AirQuality() {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [city1Error, setCity1Error] = useState("");
  const [city2Error, setCity2Error] = useState("");
  const [city1Detail, setCity1Detail] = useState<CityDetail | null>(null);
  const [city2Detail, setCity2Detail] = useState<CityDetail | null>(null);

  interface CityDetail {
    city: string;
    coordinates: Object;
    country: string;
    location: string;
    measurements: Array<any>;
  }

  const getData = (
    event: React.FormEvent<HTMLFormElement>,
    city1: string,
    city2: string
  ) => {
    event.preventDefault();
    if (!city1.length || !city2.length) {
      setErrorMessage("City name can't be empty");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };
    fetch(
      `https://api.openaq.org/v2/latest?limit=100&page=1&offset=0&sort=desc&radius=1000&city=${capitalizeFirstLetter(
        city1
      )}&order_by=lastUpdated&dumpRaw=false`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        if (!response.results.length) {
          setCity1Error(`Record for ${city1} is not found!`);
        }
        setCity1Detail(response.results[0]);
      })
      .catch((err) => console.error(err));

    fetch(
      `https://api.openaq.org/v2/latest?limit=100&page=1&offset=0&sort=desc&radius=1000&city=${capitalizeFirstLetter(
        city2
      )}&order_by=lastUpdated&dumpRaw=false`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        if (!response.results.length) {
          setCity2Error(`Record for ${city2} is not found!`);
        }
        setCity2Detail(response.results[0]);
      })
      .catch((err) => console.error(err));

    setTimeout(() => {
      setCity1Error("");
      setCity2Error("");
    }, 3000);
  };

  return (
    <div className="w-100vw h-100vh flex flex-col">
      <header className="App-header text-center py-12 flex flex-col mb-16 bg-gray-200">
        <h1>Air Quality App</h1>
        <p>Please enter city names to compare their Air Quality</p>
      </header>
      <form onSubmit={(e) => getData(e, city1, city2)}>
        <div className="main-container w-1/3 h-auto py-12 flex justify-between mx-auto">
          <div className="left-container w-[45%] flex flex-col justify-center relative">
            <label className="text-start">1st City</label>
            <Input placeholder="Enter first city name">
              <input
                style={
                  city1Error.length ? { borderColor: "red", color: "red" } : {}
                }
                onChange={(e) => setCity1(e.target.value)}
                data-testid="my-input-1"
                value={city1}
              />
            </Input>
            <p className="text-red-400 text-center absolute top-[60px] left-[45px]">
              {city1Error.length ? city1Error : ""}
            </p>
          </div>
          <div className="right-container w-[45%] flex flex-col justify-center relative">
            <label>2nd City</label>
            <Input placeholder="Enter second city name">
              <input
                style={
                  city2Error.length ? { borderColor: "red", color: "red" } : {}
                }
                onChange={(e) => setCity2(e.target.value)}
                data-testid="my-input-1"
                value={city2}
              />
            </Input>
            <p className="text-red-400 text-center absolute top-[60px] left-[45px]">
              {city2Error.length ? city2Error : ""}
            </p>
          </div>
        </div>
        {errorMessage.length ? (
          <p className="text-center text-red-400">{errorMessage}</p>
        ) : (
          ""
        )}
        <div className="action mx-auto text-center">
          <Button type="submit" className="w-32 !m-auto" basic color="red">
            Compare
          </Button>
        </div>
      </form>
      <div className="output flex flex-col w-1/3 mx-auto mt-16">
        <span className="border-2 border-black mb-6">
          <h1 className="text-center mt-20 ">Results</h1>
        </span>
        <div className="result flex">
          <div className="left w-1/2 bg-red-100 flex flex-col justify-between px-3 py-4">
            <div className="flex justify-between mb-10">
              <span>Location :</span>
              <span>
                {city1Detail?.location
                  ? city1Detail.location
                  : !city1Detail
                  ? ""
                  : "No Location Found"}
              </span>
            </div>
            <div className="flex justify-between mb-10">
              <span>City :</span>
              <span>
                {city1Detail?.city
                  ? city1Detail.city
                  : !city1Detail
                  ? ""
                  : `Record for ${city1} is not found`}
              </span>
            </div>
            <div className="flex justify-between mb-10">
              <span>Air Index Value :</span>
              {city1Detail && (
                <span>
                  {city1Detail?.measurements[0]?.value?.toFixed(2)}{" "}
                  {city1Detail?.measurements[0]?.unit}
                </span>
              )}
            </div>
          </div>
          <div className="right w-1/2 bg-blue-100 flex flex-col justify-between px-3 py-4">
            <div className="flex justify-between mb-10">
              <span>Location :</span>
              <span>
                {city2Detail?.location
                  ? city2Detail.location
                  : !city1Detail
                  ? ""
                  : "No Location Found"}
              </span>
            </div>
            <div className="flex justify-between mb-10">
              <span>City :</span>
              <span>
                {city2Detail?.city
                  ? city2Detail.city
                  : !city2Detail
                  ? ""
                  : `Record for ${city2} is not found`}
              </span>
            </div>
            <div className="flex justify-between mb-10">
              <span>Air Index Value :</span>
              <span>
                {city2Detail?.measurements[0]?.value?.toFixed(2)}{" "}
                {city2Detail?.measurements[0]?.unit}
              </span>
            </div>
          </div>
        </div>
        {city1Detail && city2Detail && (
          <h3 className="text-center mt-10">
            {" "}
            "
            {city1Detail?.measurements[0]?.value?.toFixed(2) >
            city2Detail?.measurements[0]?.value?.toFixed(2)
              ? city1Detail?.city
              : city2Detail?.city}
            " has more Air Index value then "
            {city1Detail?.measurements[0]?.value?.toFixed(2) <
            city2Detail?.measurements[0]?.value?.toFixed(2)
              ? city1Detail?.city
              : city2Detail?.city}
            "
          </h3>
        )}
      </div>
    </div>
  );
}

export default AirQuality;
