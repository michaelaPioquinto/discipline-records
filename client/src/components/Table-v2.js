import React from 'react';
import uniqid from 'uniqid';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MuiList from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch'
import Badge from '@mui/material/Badge';

import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ReorderIcon from '@mui/icons-material/Reorder';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Fade from '@mui/material/Fade';

// import KeyIcon from '@mui/icons-material/Key';
// import CakeIcon from '@mui/icons-material/Cake';
// import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';

// import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import AddBusinessIcon from '@mui/icons-material/AddBusiness';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import CreditCardIcon from '@mui/icons-material/CreditCard';
// import StoreIcon from '@mui/icons-material/Store';
// import SettingsIcon from '@mui/icons-material/Settings';
// import FemaleIcon from '@mui/icons-material/Female';
// import NumbersIcon from '@mui/icons-material/Numbers';
// import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';


export default function TableV2 ( props ){
	const Row = React.useCallback(({ index, style }) => (
		<Fade id={uniqid()} in={true} timeout={500 * index} mountOnEnter unmountOnExit>
			{ props?.generateRows?.( index, style, props, [ ] ) }
		</Fade>
	));

	return(
		<div className="table-v2 d-flex flex-column border rounded shadow">
			{/* table header */}
			<div className="table-v2-header border-bottom p-3 px-4 d-flex justify-content-between align-items-center">
				<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
					<SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
					<TextField 
						placeholder={props?.searchPlaceHolder} 
						id="table-v2-header-search-input" 
						label="" 
						variant="standard" 
						onChange={e => props?.setSearch?.( e )}
					/>
				</Box>

				{/*<IconButton>
					<FilterAltIcon/>
				</IconButton>*/}
			</div>

			{/* body header */}
			<div style={{ width: '100%' }} className="table-v2-body flex-grow-1">
				<div 
					id={uniqid()} 
					style={{ color: 'var( --text-color )'}}
					className="col-12 p-3 px-0 d-flex border-bottom"
				>	
					{ props?.generateHeader?.( props ) }
				</div>
				<AutoSizer>
					{
						({ height, width }) => (
							<List
								height={height}
								width={width}
								itemSize={45}
								itemCount={props?.items?.length}
							>
								{ Row }
							</List>
						)
					}
				</AutoSizer>
			</div>

			{/* footer header */}
			<div className="table-v2-footer p-3 px-4 border-top">
				<Badge badgeContent={props?.items?.length} color="error">
					<ReorderIcon/>
				</Badge>
			</div>
		</div>
	);
}

