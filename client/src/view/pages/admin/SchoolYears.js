import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';
import debounce from 'lodash.debounce';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import Table from '../../../components/Table';
import SearchContext from '../../../context/SearchContext';

const Item = props => {
	const [status, setStatus] = React.useState( props.status );
	const [bgColor, setBgColor] = React.useState('white');

	const handleStatus = e => {
		e.stopPropagation();

		setStatus( e.target.checked ? 'activated' : 'deactivated' );
		debouncedChangeStatus( e );
	}

	const changeStatus = async e => {
		axios.put(`http://localhost:3000/change-school-year-semester-status/${ props?._id }`, { status: e.target.checked ? 'activated' : 'deactivated' })
		.then(() => props.fetchSchoolYears())
		.catch( err => {
			throw err;
			// setTimeout(() => changeStatus(), 5000);
		});
	}

	const debouncedChangeStatus = debounce(changeStatus, 500);
	// const displayRole = userRole => userRole === 'sysadmin' ? 'SYSTEM ADMINISTRATOR' : 'ADMINISTRATOR STAFF';

	return(
		<TableRow 
			sx={{ backgroundColor: bgColor, transition: '.1s ease-in-out' }} 
			onPointerEnter={() => setBgColor('rgba(0, 0, 0, 0.2)')}
			onPointerLeave={() => setBgColor('white')}
			onDoubleClick={() => props.onDoubleClick(() => ({ editingMode: true, ...props }))}
		>
			<TableCell> { props.schoolYear } </TableCell>
			<TableCell> { props.semester } </TableCell>
			<TableCell> 
				<FormControlLabel
					onDoubleClick={e => e.stopPropagation()} 
					control={<Switch checked={status === 'activated' ? true : false} onDoubleClick={e => e.stopPropagation()} onChange={handleStatus}/>} 
					label={ status }
				/>
			</TableCell>
		</TableRow>
	);
}

const Accounts = props => {
	const [accounts, setAccounts] = React.useState( [] );
	const [items, setItems] = React.useState( [] );
	const [addForm, setAddForm] = React.useState( false );
	const [selectedItem, setSelectedItem] = React.useState( null );
	const { enqueueSnackbar } = useSnackbar();
	const search = React.useContext( SearchContext );

	const fetchSchoolYears = async () => {
		axios.get('http://localhost:3000/school-year-and-semester')
		.then( res => {
			setAccounts( res.data );
		})
		.catch( err => {
			setTimeout(() => fetchSchoolYears(), 5000);
		});
	}

	React.useEffect(() => fetchSchoolYears(), []);

	React.useEffect(() => {
		let renderedItem = [];

		accounts.forEach( acc => {
			if( acc.schoolYear.searchContain( search ) ){
				renderedItem.push( 
					<Item 
						key={uniqid()} 
						onDoubleClick ={handleEditForm} 
						fetchSchoolYears={fetchSchoolYears}
						{...acc}
					/> 
				);
			}
		});

		setItems([ ...renderedItem ]);
	}, [accounts, search]);

	const handleAddForm = async () => {
		setAddForm( addForm => !addForm );
	}

	const handleEditForm = async item => {
		setAddForm( addForm => !addForm );
		setSelectedItem( item );
	}

	React.useEffect(() => {
		if( !addForm ) setSelectedItem( null );
	}, [addForm]);

	React.useEffect(() => {
		console.log( selectedItem );	
	}, [selectedItem]);

	return(
		<div style={{ width: '100%', height: '80vh' }} className="p-3 text-center">
			<Table
				maxHeight={ 500 }
				style={{ width: '100%' }}
				head={['School Year', 'Semester', 'Status']}
				content={ items }
			/>
			{
				selectedItem
					? <EditUser
							open={addForm} 
							setOpen={handleAddForm}
							setEdit={handleEditForm} 
							fetchSchoolYears={fetchSchoolYears}
							{ ...selectedItem }
						/> 
					: <AddUser 
						open={addForm} 
						setOpen={handleAddForm}
						setEdit={handleEditForm} 
						fetchSchoolYears={fetchSchoolYears} 
					/>
			}
			<div style={{ position: 'absolute', bottom: '15px', right: '15px' }}>
				<IconButton style={{ backgroundColor: 'rgba(25, 25, 21, 0.9)' }} onClick={handleAddForm}>
					<AddIcon style={{ color: 'white' }}/>
				</IconButton>
			</div>
		</div>
	);
}

const AddUser = props => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const { enqueueSnackbar } = useSnackbar();
	
	const yearToday = new Date().getFullYear();

	const initState = {
		_id: '',
		schoolYear: '',
		semester: ''
	}

	const reducer = (state, action) => {
		switch( action.type ){
			case 'schoolYear':
				state.schoolYear = action.data;
				return state;

			case 'semester':
				state.semester = action.data;
				return state;

			default:
				return state;
		}
	}

	const [item, dispatch] = React.useReducer( reducer, initState );

	const verifySchoolYear = value => {
		if( !value ) return 'School Year is empty';

		try{
			const currentYear = new Date().getFullYear();
			const years = value.split('-');

			if( years[0].length > currentYear.length || ( years.length > 2 || years.length < 2 ) ||
				( isNaN( years[0] ) || isNaN( years[1] ) ) ||
				years[ 0 ] === years[ 1 ]
				) return 'Incorrect School Year Format';

			return null;
		}
		catch( err ){
			console.error( err );
			return '';
		}
	}

	const verifySemester = value => {
		if( !value ) return 'Semester is empty';

		try{
			if( value !== '1st' && value !== '2nd' ) {
				return 'Incorrect Semester Format';
			}

			return null;
		}
		catch( err ){
			console.error( err );
			return null;
		}
	}

	return(
		<Dialog
			fullScreen={fullScreen}
			open={props.open}
			onClose={ props.setOpen }
			maxWidth="md"
			aria-labelledby="responsive-dialog-title"
		>
			<DialogTitle id="responsive-dialog-title">
				{ "Add new school year and semester" }
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Please fill up this form.
				</DialogContentText>
				<Box
					component="form"
					sx={{
						'& > :not(style)': { m: 1, width: '500px' },
					}}
					noValidate
					autoComplete="off"
			    >	
			    	<Stack spacing={3}>
			    		<GenerateInputFields
				    		data={[
								{
									label: 'School Year',
									value: () => item.schoolYear,
									onChange: e => dispatch({ type: 'schoolYear', data: e.target.value }),
									placeHolder: 'Ex: 2018-2019'
								},
								{
									label: 'Semester',
									value: () => item.semester,
									onChange: e => dispatch({ type: 'semester', data: (e.target.value).replaceAll(' ', '') }),
									placeHolder: 'Ex: 1st'
								}	
			    			]}
						/>
			    	</Stack>
			    </Box>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={ props.setOpen }>
					Discard
				</Button>
				<Button 
					autoFocus
					onClick={() => {
						const syError = verifySchoolYear( item.schoolYear );
						const semError = verifySemester( item.semester );

						if( !syError && !semError ){
							if( item.schoolYear.length && item.semester.length ){
								axios.post('http://localhost:3000/create-school-year', { ...item })
								.then(() => {
									props.fetchSchoolYears();
									props.setOpen();
									enqueueSnackbar('Successfully added a school year', { variant: 'success' });
								})
								.catch( err => {
									enqueueSnackbar( err.response.data.message ?? 'Please try again', { variant: 'error' });
								});
							}
							else{
								enqueueSnackbar('All fields must be filled up', { variant: 'error' });
							}
						}
						else{
							[ syError, semError ].forEach( error => {
								if( error?.length ) enqueueSnackbar( error, { variant: 'error' });
							});
						}
					}}
				>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
}

const EditUser = props => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const { enqueueSnackbar } = useSnackbar();
	
	const yearToday = new Date().getFullYear();

	const initState = {
		_id: props?._id,
		schoolYear: props?.schoolYear,
		semester: props?.semester
	}

	const reducer = (state, action) => {
		switch( action.type ){
			case 'schoolYear':
				state.schoolYear = action.data;
				return state;

			case 'semester':
				state.semester = action.data;
				return state;

			default:
				return state;
		}
	}

	const [item, dispatch] = React.useReducer( reducer, initState );

	const verifySchoolYear = value => {
		if( !value ) return 'School Year is empty';

		try{
			const currentYear = new Date().getFullYear();
			const years = value.split('-');

			if( years[0].length > currentYear.length || ( years.length > 2 || years.length < 2 ) ||
				( isNaN( years[0] ) || isNaN( years[1] ) ) ||
				years[ 0 ] === years[ 1 ]
				) return 'Incorrect School Year Format';

			return null;
		}
		catch( err ){
			console.error( err );
			return '';
		}
	}

	const verifySemester = value => {
		if( !value ) return 'Semester is empty';

		try{
			if( value !== '1st' && value !== '2nd' ) {
				return 'Incorrect Semester Format';
			}

			return null;
		}
		catch( err ){
			console.error( err );
			return null;
		}
	}

	return(
		<Dialog
			fullScreen={fullScreen}
			open={props.open}
			onClose={ props.setOpen }
			maxWidth="md"
			aria-labelledby="responsive-dialog-title"
		>
			<DialogTitle id="responsive-dialog-title">
				{ "Edit this school year and semester?" }
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Please fill up this form.
				</DialogContentText>
				<Box
					component="form"
					sx={{
						'& > :not(style)': { m: 1, width: '500px' },
					}}
					noValidate
					autoComplete="off"
			    >	
			    	<Stack spacing={3}>
			    		<GenerateInputFields
				    		data={[
								{
									label: 'School Year',
									value: () => item.schoolYear,
									onChange: e => dispatch({ type: 'schoolYear', data: e.target.value }),
									placeHolder: 'Ex: 2018-2019'
								},
								{
									label: 'Semester',
									value: () => item.semester,
									onChange: e => dispatch({ type: 'semester', data: (e.target.value).replaceAll(' ', '') }),
									placeHolder: 'Ex: 1st'
								}	
			    			]}
						/>
			    	</Stack>
			    </Box>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={ props.setOpen }>
					Discard
				</Button>
				<Button 
					autoFocus
					onClick={() => {
						const syError = verifySchoolYear( item.schoolYear );
						const semError = verifySemester( item.semester );

						if( !syError && !semError ){
							if( item.schoolYear.length && item.semester.length ){
								axios.put('http://localhost:3000/edit-school-year', { ...item })
								.then(() => {
									props.fetchSchoolYears();
									props.setOpen();
									enqueueSnackbar('Successfully edited a user', { variant: 'success' });
								})
								.catch( err => {
									enqueueSnackbar( err.response.data.message ?? 'Please try again', { variant: 'error' });
								});
							}
							else{
								enqueueSnackbar('All fields must be filled up', { variant: 'error' });
							}
						}
						else{
							[ syError, semError ].forEach( error => {
								if( error?.length ) enqueueSnackbar( error, { variant: 'error' });
							});
						}
					}}
				>
					Save
				</Button>		
			</DialogActions>
		</Dialog>
	);
}

const GenerateInputFields = props => {
	const [fields, setFields] = React.useState( [] );

	React.useEffect(() => {
		if( props.data ){
			const list = [];

			props?.data?.forEach( datum => {
				console.log( datum?.value?.() );
				list.push(
					<TextField
						key={uniqid()}
						label={ datum.label ?? 'TextField' }
						variant={ props.variant ?? 'outlined' }
						defaultValue={ datum?.value?.() ?? '' }
						onChange={ datum.onChange ?? null }
						placeholder={ datum.placeHolder ?? '' }
					/>
				);
			});

			setFields([ ...list ]);
		}
	}, [props]);

	return <> { fields } </>
}

export default Accounts;