// frontend/src/components/Layout/Header.js
import React, { useState, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  Popover,
  Paper,
  List,
  ListItem,
  Chip,
  Divider,
  ListItemText,
  Button,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

const API_URL = process.env.REACT_APP_API_URL || 'http://170.64.202.114:5000';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '40ch',
      },
    },
}));

const SearchResultItem = styled(ListItem)(({ theme }) => ({
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(1, 2),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
}));


const SearchHighlight = styled('span')(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    padding: '0 4px',
    borderRadius: 2,
    color: theme.palette.primary.main,
}));

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || 'Admin';
    const lastLogin = localStorage.getItem('lastLogin') 
      ? new Date(localStorage.getItem('lastLogin')).toLocaleString()
      : 'N/A';

    const handleProfileMenuOpen = (event) => {
      setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
      setProfileAnchorEl(null);
    };

    const debouncedSearch = useCallback(
        debounce(async (value, currentAnchorEl) => {
          if (value.length < 2) {
            setSearchResults([]);
            setLoading(false);
            return;
          }
    
          try {
            const response = await axios.get(
              `${API_URL}/api/search?q=${encodeURIComponent(value)}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
    
            if (response.data.success) {
              setSearchResults(response.data.data.results);
            }
          } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
          } finally {
            setLoading(false);
          }
        }, 1000), // 1 seconds delay
        []
    );


    const handleSearch = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        setAnchorEl(event.currentTarget);
        setLoading(true);
        debouncedSearch(value, event.currentTarget);
    };

  const handleResultClick = (result) => {
    setAnchorEl(null);
    setSearchTerm('');
    setSearchResults([]);
    navigate(`/content/${result.path}?search=${encodeURIComponent(searchTerm)}&position=${result.position}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const open = Boolean(anchorEl) && searchResults.length > 0;

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Button
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ 
            textTransform: 'none',
            fontSize: 'h6.fontSize',
            fontWeight: 'bold'
          }}
        >
          Knowledge Base
        </Button>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            value={searchTerm}
            onChange={handleSearch}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
            if (!searchTerm) {
              setSearchResults([]);
            }
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: { width: '400px', maxHeight: '400px', overflow: 'auto' }
          }}
        >
          <List>
            {loading ? (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 2 }}>Searching...</Typography>
              </Box>
            ) : (
              searchResults.map((result, index) => (
                <ListItem 
                  button 
                  key={index}
                  onClick={() => handleResultClick(result)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemText
                    primary={result.title}
                    secondary={
                      <Box>
                        {result.section && (
                          <Typography 
                            component="span" 
                            variant="body2" 
                            color="primary"
                          >
                            {result.section}
                          </Typography>
                        )}
                        <Typography component="p" variant="body2">
                          {result.context.before}
                          <strong>{result.context.match}</strong>
                          {result.context.after}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Popover>

        <Box sx={{ flexGrow: 1 }} />
        
        {/* Profile Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={handleProfileMenuOpen}
            size="large"
            edge="end"
            color="inherit"
          >
            <Avatar sx={{ bgcolor: 'primary.dark', width: 32, height: 32 }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              sx: {
                width: 300,
                maxWidth: '100%',
                mt: 1.5
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" component="div">
                {username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Login: {lastLogin}
              </Typography>
            </Box>
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/profile');
            }}>
              <ListItemIcon>
                <PersonOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;