import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import {AppBar, Box, Button, Toolbar} from "@mui/material";
import React, {FC} from "react";


/* eslint-disable-next-line */
export interface HeaderProps {
  handleNavigation: any
}


const pages = ['Journeys', 'Stations'];


export const Header: FC<HeaderProps> = ({handleNavigation}) => {
  const handleMenuClick = (e: any) => {
    handleNavigation(e.target.value);
  }

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <DirectionsBikeIcon sx={{display: {xs: 'flex', md: 'flex'}, mr: 1}}/>
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map((page) => (
              <Button
                key={page}
                value={page.toLowerCase()}
                onClick={handleMenuClick}
                sx={{my: 2, color: 'white', display: 'block'}}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

