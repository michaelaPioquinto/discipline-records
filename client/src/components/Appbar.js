import React from 'react';
import uniqid from 'uniqid';
import axios from 'axios';
import Cookies from 'js-cookie';

import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useSnackbar } from 'notistack';

import Chip from '@mui/material/Chip';


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

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const Appbar = props => {
	const [drawer, setDrawer] = React.useState( false );
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
	const [allowSearch, setSearchAllow] = React.useState( props?.openSearchOn?.includes?.( props?.listItems?.[0]?.title ) ?? false );

	const { enqueueSnackbar } = useSnackbar();

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

	const handleSignout = async () => {
		axios.delete('http://localhost:3000/sign-out')
		.then(() => {
			Cookies.remove('token');
			Cookies.remove('rtoken');

			props.tools.setView('/sign-in');
		})
		.catch( err => {
			setTimeout(() => handleSignout(), 5000);
		});
	}

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
						aria-label="log out account of current user"
						aria-controls="primary-search-account-menu"
						aria-haspopup="true"
						color="inherit"
						onClick={handleSignout}
					>
						<MeetingRoomIcon/>
					</IconButton>
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
		     	<MenuItem onClick={handleSignout}>Sign-out</MenuItem>
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
						<ListItem 
							key={uniqid()} 
							button 
							onClick={() => {
								item.onClick();
								setSearchAllow( props?.openSearchOn?.includes?.( item?.title ) ?? false );
							}}
						>
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
			<AppBar id="main-app-bar" position="static" sx={{ backgroundColor: 'black !important', color: 'white !important' }}>
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
					<div className="col-4 d-flex justify-content-start align-items-center">
						<b id="app-title" className="p-0 m-0">Discipline Records Management</b>
					</div>
					{
						allowSearch
							? (
									<Search>
										<SearchIconWrapper>
										  <SearchIcon />
										</SearchIconWrapper>
										<StyledInputBase
											onChange={props.getSearchContent}
											placeholder="Search…"
											inputProps={{ 'aria-label': 'search' }}
										/>
									</Search>
								)
							: null
					}
					<Box sx={{ flexGrow: 1 }} />
          <Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ display: { xs: 'none', sm: 'block' } }}
					>
						{ props.title ?? 'Menu' }
					</Typography>
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
        	<div className="continer-fluid p-2 d-flex justify-content-center align-items-center">
						<img id="cct-logo" src="images/cctLogo_new.ico" alt="cct logo"/>
        	</div>
        	<Divider/>
          { list() }
          {
          	props.tools.role === 'sysadmin'
          		? (
          				<>
          					<Divider/>
					          <br/>
					          <div className="d-flex justify-content-center align-items-center">
						          <Button 
						          	onClick={() => {
						          		axios.get('http://localhost:3000/back-up')
						          		.then( res => {
						          			enqueueSnackbar( 'Downloading...', { variant: 'success' });

						          			const { student, user, sanction, statistic, report, archived, schoolYear } = res.data;
						          			const objList = [ student, user, sanction, statistic, report, archived, schoolYear ];
						          			const names = [ 'student', 'user', 'sanction', 'statistic', 'report', 'archived', 'schoolYear' ];

						          			objList.forEach((obj, index) => {
						          				var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify( obj ));

						          				const link = document.createElement('a');
						          				link.href = `data:${data}`;
						          				link.setAttribute('download', `${names[ index ]}.json`);

						          				document.body.appendChild( link );
															link.click();
						          				// $('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#container');
						          			});	
						          		})
						          		.catch( err => {
						          			console.log( err );
						          			enqueueSnackbar( 'Please try again later.', { variant: 'error' });
						          		});
						          	}}
						          	variant="filled" 
						          	sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white'}}
						          >
						          	back up
						          </Button>
					          </div>
          				</>
          			)
          		: null
          }
          { props.tools.role === 'student' ? <StudentTreeView setSelectedYearAndSem={props.setSelectedYearAndSem} studentID={props.tools.name}/> : null }
        </Drawer>
        { props.children }
		</>
	)
}

const StudentTreeView = props => {
	const [schoolYear, setSchoolYear] = React.useState( [] );

	const [selected, setSelected] = React.useState( Number(Cookies.get('slctd')) ?? 2 );
	const [expanded, setExpanded] = React.useState( Cookies.get('xpndd')?.length ? JSON.parse( Cookies.get('xpndd') ) : ['1'] );
	const [label, setLabel] = React.useState( '' );

	React.useEffect(() => {
		if( props.studentID ){
			const schoolYears = [];

			/*
				Finding school year is based on the student ID. Our school ID's first two digits are indicating what year
				we enrolled. 

				For example: 1801201

				The "18" in "1801201" means that the year the student enrolled was on 2018, but we can not assume that the year will be 
				in the range of 2000, so we have to get the current year and get the first two digits of it.

				For example: 2022

				The "20" in "2022" means the current year is in the range of 2000, so when we get into 3000 we can still get the exact year
				the student enrolled.
			*/
			const yearStarted = Number(new Date().getFullYear().toString().slice( 0, 2 ) + props.studentID.slice( 0, 2 ));
			let currentSchoolYear = yearStarted;

			for( let i = 0; i < 4; i++ ){
				schoolYears.push( `${currentSchoolYear}-${currentSchoolYear + 1}` );
				currentSchoolYear += 1;
			}

			setSchoolYear([ ...schoolYears ]);
		}
	}, [props]);

	const getSemester = sem => Number( sem ) % 2 === 0 ? '1st semester' : '2nd semester';

	React.useEffect(() => {
		if( schoolYear.length ){
			if( String( selected ) === '2' || String( selected ) === '3' ){
				Cookies.set('slctd', selected);
				setLabel( `${schoolYear[ 0 ]} - ${getSemester( selected )}` );
			}
			else if( String( selected ) === '6' || String( selected ) === '7' ){
				Cookies.set('slctd', selected);
				setLabel( `${schoolYear[ 1 ]} - ${getSemester( selected )}` );
			}
			else if( String( selected ) === '10' || String( selected ) === '11' ){
				Cookies.set('slctd', selected);
				setLabel( `${schoolYear[ 2 ]} - ${getSemester( selected )}` );
			}
			else if( String( selected ) === '14' || String( selected ) === '15' ){
				Cookies.set('slctd', selected);
				setLabel( `${schoolYear[ 3 ]} - ${getSemester( selected )}` );
			}
		}
	}, [selected, schoolYear]);

	React.useEffect(() => {
		Cookies.set('xpndd', JSON.stringify([expanded?.[ 0 ]]));
	}, [expanded]);

	React.useEffect(() => {
		Cookies.set('crrntslctd', label);
		props?.setSelectedYearAndSem?.( label );
	}, [label]);

	return(
			<>
				<Root>
					<Divider textAlign="left" sx={{ width: '100%', margin: '50px 0px 25px 0px'}}>
						<Chip 
							icon={<ListAltIcon fontSize="small"/>} 
							sx={{ borderColor: 'black', padding: '0px 5px 0px 5px' }} 
							variant="outlined" label={label}
						/>
					</Divider>
				</Root>
				<TreeView
	        aria-label="controlled"
	        defaultCollapseIcon={<ExpandMoreIcon fontSize="large"/>}
	        defaultExpandIcon={<ChevronRightIcon fontSize="large"/>}
	        selected={selected}
	        expanded={expanded}
	        onNodeToggle={(_, nodeIds) => setExpanded( nodeIds )}
	        onNodeSelect={(_, nodeIds) => setSelected( nodeIds )}
	        // expanded={expanded}
	      >
	        <TreeItem nodeId="1" label={schoolYear[ 0 ]}>
	          <TreeItem nodeId="2" label="1st semester" />
	          <TreeItem nodeId="3" label="2nd semester" />
	        </TreeItem>
	        
	        <TreeItem nodeId="5" label={schoolYear[ 1 ]}>
	          <TreeItem nodeId="6" label="1st semester" />
	          <TreeItem nodeId="7" label="2nd semester" />
	        </TreeItem>

	        <TreeItem nodeId="9" label={schoolYear[ 2 ]}>
	          <TreeItem nodeId="10" label="1st semester" />
	          <TreeItem nodeId="11" label="2nd semester" />
	        </TreeItem>

	        <TreeItem nodeId="13" label={schoolYear[ 3 ]}>
	          <TreeItem nodeId="14" label="1st semester" />
	          <TreeItem nodeId="15" label="2nd semester" />
	        </TreeItem>
	      </TreeView>
      </>
		)
}

export default Appbar;