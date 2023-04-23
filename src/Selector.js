import {
  Box,
  Button,
  TextField,
  Menu,
  MenuItem
} from '@mui/material'

import * as React from 'react';
//import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
//import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, ListItemAvatar } from '@mui/material';

import { useRef, useState } from 'react';

  function Selector(props) {
    const clientId = 'bbbd71d9c98a4bc39b1a21675d1b1072';
    const clientSecret = '61e84bce2a0847e88002488b51a5d990';
    const redirectUri = 'http://localhost:3000';

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
      });

    // list of places objects
    const places = props.places
    console.log("PLACES", places)
    
    const toggleDrawer = (anchor, open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
  
      setState({ ...state, [anchor]: open });
    };
  
    const list = (anchor) => (
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {places.map((place) => (
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar src={place.photos[0].getUrl({maxWidth: 400, maxHeight: 400})}></Avatar>
                </ListItemAvatar>
                <ListItemText>{place.place_id}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );

    let selectedStopName = "placeholder stop"

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    function generateRandomString(length) {
      let text = '';
      let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    async function generateCodeChallenge(codeVerifier) {
      function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      }
    
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
    
      return base64encode(digest);
    }

    function getUserAuth() {
      let codeVerifier = generateRandomString(128);

      generateCodeChallenge(codeVerifier).then(codeChallenge => {
        let state = generateRandomString(16);
        let scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';

        localStorage.setItem('code-verifier', codeVerifier);

        let args = new URLSearchParams({
          response_type: 'code',
          client_id: clientId,
          scope: scope,
          redirect_uri: redirectUri,
          state: state,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge
        });

        window.location = 'https://accounts.spotify.com/authorize?' + args;
      });

      //const urlParams = new URLSearchParams(window.location.search)
      //console.log(code)
      //localStorage.setItem('code', code);
      //localStorage.setItem('urlParamsAuth', urlParams);
    }

    function getAuthCode() {
      let codeVerifier = localStorage.getItem('code-verifier');
      const urlParams = new URLSearchParams(window.location.search);

      let code = urlParams.get('code');
      //console.log(code)

      let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
        code_verifier: codeVerifier
      });


      const response = fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem('access-token', data.access_token);
          console.log(data.access_token);
        })
        .catch(error => {
          console.error('Error:', error);
        });

    }

    function getUserProfile() {
      let url = "https://api.spotify.com/v1/me"

      const response = fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('access-token')
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem('user-data', data);
          localStorage.setItem('user-id', data.id);
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    function createPlaylist() {
      //console.log(localStorage.getItem('access-token'))

      let url = "https://api.spotify.com/v1/users/"+localStorage.getItem('user-id')+"/playlists"

      let body = JSON.stringify({
        name: "Road Trip Playlist",
        description: "Created by Road Trip Application",
        collaborative: false,
        public: false
      });

      const response = fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('access-token'),
          'Content-type': 'application/json'
        },
        body: body
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem('playlist-id', data.id);
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    function addSong() {
      let url = "https://api.spotify.com/v1/playlists/"+localStorage.getItem('playlist-id')+"/tracks"

      let uriStr = "spotify:track:"+document.getElementById('song-input').value
      let uriArr = uriStr.split(' ')

      let body = JSON.stringify({
        position: 0,
        uris: uriArr
      });

      const response = fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('access-token'),
          'Content-type': 'application/json'
        },
        body: body
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    function addSong(uriStr) {
      let url = "https://api.spotify.com/v1/playlists/"+localStorage.getItem('playlist-id')+"/tracks"

      let uriArr = uriStr.split(' ');
      uriArr.pop();

      let body = JSON.stringify({
        position: 0,
        uris: uriArr
      });

      const response = fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('access-token'),
          'Content-type': 'application/json'
        },
        body: body
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    function createPlaylistByGenre() {
      let url = "https://api.spotify.com/v1/users/"+localStorage.getItem('user-id')+"/playlists"

      let body = JSON.stringify({
        name: "Road Trip Playlist",
        description: "Created by Road Trip Application, "+document.getElementById('genre-input').value+ " genre",
        collaborative: false,
        public: false
      });

      const response = fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('access-token'),
          'Content-type': 'application/json'
        },
        body: body
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem('playlist-id', data.id);
          console.log(data);
          searchByGenre();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    function searchByGenre() {
      let offset = Math.floor(Math.random() * 5);
      console.log(offset)
      let url = "https://api.spotify.com/v1/search?q=genre:"+document.getElementById('genre-input').value+"&type=track&limit="+document.getElementById('length-input').value+"&offset="+offset;

      const response = fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.getItem('access-token'),
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log(data.tracks.items);
          let uriStr = "";
          for(const element of data.tracks.items) {
            let idStr = "spotify:track:"+element.id+" ";
            uriStr += idStr;
          }
          console.log(uriStr);
          addSong(uriStr);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    return (
      <div>
        <div>
          {['My Trips'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer
                anchor='left'
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {list(anchor)}
                <h2>My Trips</h2>
                <p>Clickable list of trips goes here, clicking a trip will open a popup menu.</p>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  Placeholder Trip
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>Add Stop</MenuItem>
                  <MenuItem onClick={handleClose}>Rate Trip</MenuItem>
                  <MenuItem onClick={handleClose}>Delete Trip</MenuItem>
                </Menu>
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <div>
          {['Saved Stops'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer
                anchor='left'
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {list(anchor)}
                <h2>Saved Stops</h2>
                <p>Clickable list of stops goes here, clicking a stop brings up some options.</p>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  Placeholder Stop
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>Add to Trip</MenuItem>
                  <MenuItem onClick={handleClose}>Remove from Saved</MenuItem>
                </Menu>
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <div>
          {['Playlists'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer
                anchor='left'
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {list(anchor)}
                <h2>Playlists</h2>
                <Button
                  id="basic-button"
                  onClick={getUserAuth}
                >
                  Authorize
                </Button>
                <Button
                  id="basic-button"
                  onClick={getAuthCode}
                >
                  Update Authorization
                </Button>
                <Button
                  id="basic-button"
                  onClick={getUserProfile}
                >
                  Get Profile Info
                </Button>
                <Button
                  id="basic-button"
                  onClick={createPlaylist}
                >
                  Create Empty Playlist
                </Button>
                <TextField 
                  id="song-input" 
                  label="Spotify Song ID" 
                  variant="outlined"
                  defaultValue="5gB2IrxOCX2j9bMnHKP38i"
                />
                <Button
                  id="basic-button"
                  onClick={addSong}
                >
                  Add Song  
                </Button>
                <TextField 
                  id="genre-input" 
                  label="Genre" 
                  variant="outlined"
                  defaultValue="country"
                />
                <br/>
                <TextField 
                  id="length-input" 
                  label="Length" 
                  variant="outlined"
                  defaultValue="10"
                />
                <Button
                  id="basic-button"
                  onClick={createPlaylistByGenre}
                >
                  Generate Playlist  
                </Button>
              </Drawer>
            </React.Fragment>
          ))}
        </div>
      </div>
      /* stop Rating menu
        <div>
          {['Rate This Stop'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer
                anchor='left'
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {list(anchor)}
                <h2>Stop: {selectedStopName}</h2>
                <p>Rate This Stop</p>
                <p>Tell us what you thought about {selectedStopName}:</p>
                <TextField>
                  
                </TextField>
                <Button>Rate</Button>
                
              </Drawer>
                
            </React.Fragment>
          ))}
        </div>
      */
      /* Old code
      <div>
        {['My Trips', 'Saved Stops', 'Rate This Stop', 'My Account'].map((anchor) => (
          <React.Fragmx`ent key={anchor}>
            <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
            <Drawer
              anchor='left'
              //anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
              <TextField
                id="test"
                label="testing"
                type="text"
                inputRef={useRef}
                placeholder="Hello World"
              />
            </Drawer>
          </React.Fragment>
        ))}
      </div>
      */
    );
    
  }

  export default Selector