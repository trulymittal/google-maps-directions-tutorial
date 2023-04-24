// Imports
import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  IconButton,
  TextField,
  Skeleton,
  Typography,
} from '@mui/material'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoWindow
} from '@react-google-maps/api'
import { useRef, useState } from 'react'
import Selector from './Selector'

// Application start

function App() {
  // All Const data

  const center = { lat: 31.548304205672842, lng: -97.14529671208537 }
  const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15
  }
  const google = window.google
  const libraries = ["places"]

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyByb_0rLllqdRWsqNC2sJhn58skYqSkVhI',
    libraries: libraries,
    
  })

  const onLoadStreetView = (streetViewService) => {
    streetViewService.getPanorama({
      location: center, 
      radius: 50
    }, (data, status) => console.log(
      "StreetViewService results",
      { data, status }
    ))
  };

  // Changables

  let service = null
  let places = []
  // let streetViewService = null

  // State management

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [infoWindowLocation, setinfoWindowLocation] = useState({ lat: 48.8584, lng: 2.2945 })
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [infoWindowContent, setInfoWindowContent] = useState('Default content');
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef()
  const stopRef = useRef()

  // If we cant load we will return the skeleton
  if (!isLoaded) {
    return <Skeleton />
  }

  async function calculateRoute() {
    console.log("CALCULATING")
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }
    // Logic for crafting waypoints
    let waypoints = []
    if(stopRef.current.value !== '') {
      waypoints.push({
        location: stopRef.current.value,
        stopover: true
      })
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      waypoints: waypoints,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    console.log('results: ', results)
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }
  

  async function getInfoByPlaceID(place_id) {
      return new Promise((resolve, reject) => {
        const request = {
          placeId: place_id,
          fields: ['name', 'rating', 'photos', 'formatted_phone_number', 'website']
      };
      
      console.log(request)
      
      service.getDetails(request, (place, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          reject(new Error('Failed to get place details'));
        }
      })

    })
  }
  

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    stopRef.current.value = ''
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  // Our application page
  return (
    
    <Box height='100%' width='100%' sx={{ display: 'flex', flexDirection: 'row'}}>
      <Box position='absolute' left={0} top={0} height='100%' width='100%'>
        {/* Google Map Box */}
        <GoogleMap
          id="map"
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '80%', height: '80%' }}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true
          }}
          onLoad={map => {
            service = new google.maps.places.PlacesService(map)
            map.addListener("click", async (e) => {
              // Stop the default popup with e.stop()
              e.stop()

              if(e.placeId != null){
                const data = await getInfoByPlaceID(e.placeId)
                setInfoWindowContent(<>
                  <h2>Name: {data.name}</h2>
                  <p>Phone Number: {data.formatted_phone_number}</p>
                  <p>Website: <a href={data.website}>{data.website}</a></p>
                  <p>Rating: {data.rating}</p>
                  <img src={data.photos[0].getUrl({maxWidth: 400, maxHeight: 400})}></img>
                </>)
                setinfoWindowLocation(e.latLng)
                setShowInfoWindow(true)
              }
            })
            setMap(map)
          }}>

          {showInfoWindow && (
            <InfoWindow
              position={infoWindowLocation}
              onCloseClick={() => setShowInfoWindow(false)}
              map={map}
            >
              <div style={divStyle}>
                {infoWindowContent}
              </div>
            </InfoWindow>
          )}

          {/* <Marker position={center} /> */}
          {directionsResponse && (
            <DirectionsRenderer options={{
              directions: directionsResponse,
              draggable: true
            }}/>
          )}

        </GoogleMap>

        <div id="infowindow-content">
          <img id="place-icon" src="" height="16" width="16" />
          <span id="place-name" class="title"></span><br />
          <span id="place-id"></span><br />
          <span id="place-address"></span>
        </div>
      </Box>

      <Box 
        p={4}
        borderRadius="lg"
        m={4}
        bgcolor="white"
        shadow="base"
        minW="container.md"
        zIndex="1">
        <Stack spacing={2} direction="row">
          <Box flexGrow={1}>
            <Autocomplete>
            <TextField
              id="origin"
              label="Origin"
              type="text"
              inputRef={originRef}
              placeholder="Origin"
            />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
            <TextField
              id="additionalStop"
              label="Additional Stop"
              type="text"
              inputRef={stopRef}
              placeholder="Additional Stop"
            />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
            <TextField
              id="destination"
              label="Destination"
              type="text"
              inputRef={destinationRef}
              placeholder="Destination"
            />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button color='primary' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </Stack>
        <Stack spacing={4} direction="row">
          <Typography>Distance: {distance} </Typography>
          <Typography>Duration: {duration} </Typography>
          <Selector places = {places}></Selector>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default App
