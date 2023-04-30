import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  VStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: 48.8584, lng: 2.2945 };

function App() {
  //const [markers, setMarker] = useState([])

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [waypoints, setWaypoints] = useState([]);
  const [optimize, setOptimize] = useState(true);
  const [markers, setMarkers] = useState([
    { lat: 48.8584, lng: 2.2945 },
    { lat: 48.8595, lng: 2.2945 },
  ]);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const adjectiveRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function fetchData(url, queryParams) {
    try {
      const urlObject = new URL(url);
      urlObject.search = new URLSearchParams(queryParams).toString();
      const response = await fetch(urlObject.toString());

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data:", data);

      const newWaypoints = data.results.map((result) => result.name);
      setWaypoints(newWaypoints);
      return newWaypoints;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function calculateRoute() {
    if (
      originRef.current.value === "" ||
      destinationRef.current.value === "" ||
      adjectiveRef.current.value === ""
    ) {
      return;
    }

    // // eslint-disable-next-line no-undef
    // const autocomplete = new google.maps.places.Autocomplete(
    //   originRef.current.value,
    //   {
    //     fields: ["place_id"],
    //   }
    // );
    // console.log(autocomplete.getPlace());

    const url = "https://detour-ai-mit.uk.r.appspot.com";
    const queryParams = {
      key: "beaver",
      origin: "ChIJh2oa9apw44kRPCAIs6WO4NA",
      destination: "ChIJLw8wo4Vw44kRWkWR0c03LH4",
      keyword: adjectiveRef.current.value,
      modelWeight: 20,
      distanceWeight: 0,
      popularityWeight: 10,
      targetCount: 3,
    };

    const newWaypoints = await fetchData(url, queryParams);
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      waypoints: newWaypoints.map((waypoint) => ({
        location: waypoint,
        stopover: true,
      })),
      optimizeWaypoints: optimize,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text); // TODO: sum all legs
    setDuration(results.routes[0].legs[0].duration.text); // TODO: sum all legs
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setWaypoints([]);
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  function handleMarkerClick(index) {
    return () => {
      console.log(index);
    };
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        position="absolute"
        left={0}
        top={0}
        h="100%"
        p={4}
        borderRadius="lg"
        bgColor="white"
        shadow="base"
        minW={200}
        zIndex="1"
      >
        <VStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                ref={destinationRef}
              />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Input type="text" placeholder="Adjective" ref={adjectiveRef} />
          </Box>

          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </VStack>
        <VStack spacing={4} mt={4} justifyContent="space-between">
          <Checkbox onChange={(e) => setOptimize(e.target.checked)}>
            Optimize Route
          </Checkbox>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          {/* <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          /> */}
        </VStack>
      </Box>
    </Flex>
  );
}

export default App;
