import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import InputBase from '@mui/material/InputBase';
import {styled, alpha} from '@mui/material/styles';
import {useEffect, useState} from "react";

const SearchComponent = styled('div')(({theme}) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '60ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));
/* eslint-disable-next-line */
export interface SearchProps {
  searchFunction: (search: string) => void
}

export const Search = ({searchFunction}: SearchProps) => {
  const [search, setSearch] = useState<string>();
  const hook = () => {
    // console.log('search country', country);
    if(typeof search == 'string' && search.length >1){
      searchFunction(search.toLowerCase())
    }
  }
  useEffect(hook, [search])
  return (
    <SearchComponent>
      <SearchIconWrapper>
        <SearchIcon/>
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search... minimum 2 letters"
        inputProps={{'aria-label': 'search '}}
        onChange={event => setSearch(event.target.value)}
      />
    </SearchComponent>
  );
}

