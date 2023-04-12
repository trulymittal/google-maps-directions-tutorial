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

   
    /*
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const openTripMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const closeTripMenu = () => {
      setAnchorEl(null);
    };
    const addStop = () => {
      setAnchorEl(null);
    };
    const rateTrip = () => {
      setAnchorEl(null);
    };
    const deleteTrip = () => {
      setAnchorEl(null);
    };*/
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };


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