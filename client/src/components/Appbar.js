import React from 'react';
import uniqid from 'uniqid';


import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MoreIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


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
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


const Appbar = props => {
	const [drawer, setDrawer] = React.useState( false );
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

	const toggleDrawer = open => event => {
	    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
	      return;
	    }

	    setDrawer( false );
	};

	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
		  anchorEl={mobileMoreAnchorEl}
		  anchorOrigin={{
		    vertical: 'top',
		    horizontal: 'right',
		  }}
		  id={mobileMenuId}
		  keepMounted
		  transformOrigin={{
		    vertical: 'top',
		    horizontal: 'right',
		  }}
		  open={isMobileMenuOpen}
		  onClose={handleMobileMenuClose}
		>
			<MenuItem onClick={handleProfileMenuOpen}>
				<Stack>
					<IconButton
						size="small"
						aria-label="account of current user"
						aria-controls="primary-search-account-menu"
						aria-haspopup="true"
						color="inherit"
					>
						<AccountCircle/>
					</IconButton>
					<p>Profile</p>
					<Divider/>
					<IconButton
						size="small"
						aria-label="log out account of current user"
						aria-controls="primary-search-account-menu"
						aria-haspopup="true"
						color="inherit"
					>
						<MeetingRoomIcon/>
					</IconButton>
					<p>Logout</p>
				</Stack>
			</MenuItem>
		</Menu>
	);

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
	    <Menu
	      anchorEl={anchorEl}
	      anchorOrigin={{
	        vertical: 'top',
	        horizontal: 'right',
	      }}
	      id={menuId}
	      keepMounted
	      transformOrigin={{
	        vertical: 'top',
	        horizontal: 'right',
	      }}
	      open={isMenuOpen}
	      onClose={handleMenuClose}
	    >
	    	<Stack sx={{padding: '2px 10px 2px 10px'}}>
		     	<MenuItem onClick={handleMenuClose}>Profile</MenuItem>
		     	<MenuItem onClick={handleMenuClose}>Sign-out</MenuItem>
	    	</Stack>
	    </Menu>
	);

	// Data to be received must be looked like this { title: <List_title>, onClick: <function> }
	const list = () => (
	    <Box
	      sx={{ width: 240, padding: '10px 20px 20px 10px' }}
	      role="presentation"
	      onClick={toggleDrawer(false)}
	      onKeyDown={toggleDrawer(false)}
	    >
			<List>
				{props?.listItems?.map?.((item, index) => (
					<ListItem button onClick={item.onClick}>
						<ListItemIcon>
							<ArrowForwardIosIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText primary={item.title} />
					</ListItem>
				))}
			</List>
	    </Box>
	);
	
	return(
		<>
			<AppBar position="static" sx={{ backgroundColor: 'black' }}>
		        <Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="open drawer"
						sx={{ mr: 2 }}
						onClick={() => setDrawer( true )}
					>
						<MenuIcon />
					</IconButton>
		            <Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ display: { xs: 'none', sm: 'block' } }}
					>
						{ props.title ?? 'Menu' }
					</Typography>
					<Search>
						<SearchIconWrapper>
						  <SearchIcon />
						</SearchIconWrapper>
					<StyledInputBase
						placeholder="Search…"
						inputProps={{ 'aria-label': 'search' }}
					/>
					</Search>
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
					<IconButton
						size="large"
						edge="end"
						aria-label="account of current user"
						aria-controls={menuId}
						aria-haspopup="true"
						onClick={handleProfileMenuOpen}
						color="inherit"
					>
						<AccountCircle />
					</IconButton>
					</Box>
					<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="show more"
							aria-controls={mobileMenuId}
							aria-haspopup="true"
							onClick={handleMobileMenuOpen}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
					</Box>
		        </Toolbar>
		    </AppBar>
		    {renderMobileMenu}
		    {renderMenu}
		    <Drawer
	            anchor="left"
	            open={drawer}
	            onClose={toggleDrawer(false)}
	        >
	            { list() }
	        </Drawer>
	        { props.children }
		</>
	)
}

export default Appbar;