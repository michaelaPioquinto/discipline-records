import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';
import debounce from 'lodash.debounce';

import Autocomplete from '@mui/material/Autocomplete';
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
import DeleteIcon from '@mui/icons-material/Delete';

import TableV2 from '../../../components/Table-v2';
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
		axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/change-school-year-semester-status/${ props?._id }`, { status: e.target.checked ? 'activated' : 'deactivated' })
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
			<TableCell> 
				<IconButton onClick={() => props.handleDelete( props._id )}>
					<DeleteIcon/>
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

const Accounts = props => {
	const [accounts, setAccounts] = React.useState( [] );
	const [items, setItems] = React.useState( [] );
	const [addForm, setAddForm] = React.useState( false );
	const [editForm, setEditForm] = React.useState( false );
	const [selectedItem, setSelectedItem] = React.useState( null );
	const { enqueueSnackbar } = useSnackbar();
	const search = React.useContext( SearchContext );

	const fetchSchoolYears = async () => {
		axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/school-year-and-semester`)
		.then( res => {
			setAccounts( res.data );
		})
		.catch( err => {
			setTimeout(() => fetchSchoolYears(), 5000);
		});
	}

	const handleDelete = id => {
		axios.delete(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/delete-school-year-and-semester/${id}`)
		.then( res => {
			fetchSchoolYears();
		})
		.catch( err => {
			console.error( err );
			throw err;
		});	
	}

	React.useEffect(() => fetchSchoolYears(), []);

	React.useEffect(() => {
		let renderedItem = [];

		// <Item 
		// 	key={uniqid()} 
		// 	onDoubleClick ={handleEditForm} 
		// 	fetchSchoolYears={fetchSchoolYears}
		// 	handleDelete={handleDelete}
		// 	{...acc}
		// /> 
		accounts?.sort?.(( ac1, ac2 ) => Number(ac1?.semester[ 0 ]) - Number(ac2?.semester[ 0 ]));
		accounts?.sort?.(( ac1, ac2 ) => Number(ac1?.schoolYear?.split?.('-')?.[ 0 ]) - Number(ac2?.schoolYear?.split?.('-')?.[ 0 ]))

		accounts.forEach( acc => {
			const years = acc.schoolYear.split('-');

			if( years[ 0 ].searchContain( search ) || years[ 1 ].searchContain( search ) ){
				renderedItem.push( acc );
			}
		});

		setItems([ ...renderedItem ]);
	}, [accounts, search]);

	const handleAddForm = async () => {
		setAddForm( addForm => !addForm );
		// if( addForm === true ) setSelectedItem( null );
	}

	const handleEditForm = async item => {
		setEditForm( editForm => !editForm );
		setSelectedItem( item );
	}

	React.useEffect(() => {
		if( !editForm ) setSelectedItem( null );
	}, [editForm]);

	return(
		<>
			<TableV2
				items={items}
				onDoubleClick ={handleEditForm} 
				fetchSchoolYears={fetchSchoolYears}
				handleDelete={handleDelete}
				setSearch={props?.getSearchContent}
				searchPlaceHolder="School-Year"
				generateRows={( index, style, props ) => {

					const handleStatus = e => {
						e.stopPropagation();
						debouncedChangeStatus( e );
					}

					const changeStatus = async e => {
						axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/change-school-year-semester-status/${ props?.items?.[ index ]['_id'] }`, 
							{ 
								status:  props?.items?.[ index ]?.status === 'deactivated' ? 'activated' : 'deactivated' 
							}
						)
						.then(() => props.fetchSchoolYears())
						.catch( err => {
							throw err;
							// setTimeout(() => changeStatus(), 5000);
						});
					}

					const debouncedChangeStatus = debounce(changeStatus, 100);

					return(
						<div 
				            id={uniqid()} 
				            style={{ ...style }} 
				            className="table-v2-row col-12 d-flex"
							onDoubleClick={() => props.onDoubleClick({ editingMode: true, ...props.items[ index ] })}
						> 
				            <div 
				              style={{
				                borderRight: '1px solid rgba(0, 0, 0, 0.1)'
				              }} 
				              className={`col-4 d-flex align-items-center justify-content-center text-center"`}
				            >
				              { props?.items?.[ index ]?.schoolYear }
				            </div>
				            <div 
				            	style={{
				            		color: props?.items?.[ index ]?.semester === '1st' ? "#ff0006" : '#e7a100',
				            		fontWeight: 'bold' 
				            	}} 
				            	className={`col-4 d-flex align-items-center justify-content-center text-center"`}
				            >
				              { props?.items?.[ index ]?.semester }
				            </div>
				            <div 
				              style={{
				                borderLeft: '1px solid rgba(0, 0, 0, 0.1)'
				              }} 
				              className={`col-4 text-capitalize d-flex align-items-center justify-content-center text-center"`}
				            >
								<FormControlLabel
									onDoubleClick={e => e.stopPropagation()} 
									control={
										<Switch 
											checked={props?.items?.[ index ]?.status === 'activated'} 
											onDoubleClick={e => e.stopPropagation()} 
											onChange={handleStatus}
										/>
									} 
									label={ props?.items?.[ index ]?.status }
								/>
				            </div>
			          </div>
			         )
				}}

				         //    <div 
				         //    	style={{
					        //         borderLeft: '1px solid rgba(0, 0, 0, 0.1)'
					        //       }}
					        //     className="col-2 text-capitalize d-flex align-items-center justify-content-center text-center"
					        // >
				         //    	<IconButton onClick={() => handleDelete( props?.items?.[ index ]?._id )}>
				         //    		<DeleteIcon/>
				         //    	</IconButton>
				         //    </div>
				generateHeader={props => (
					<>
			            <div className={`col-4 d-flex align-items-center justify-content-center text-center"`}>
			              <b>School Year</b>
			            </div>
			            <div className={`col-4 d-flex align-items-center justify-content-center text-center"`}>
			              <b>Semester</b>
			            </div>
			            <div className={`col-4 d-flex align-items-center justify-content-center text-center"`}>
			              <b>Status</b>
			            </div>
			          </>
				)}
			/>
			            {/*<div className={`col-2 d-flex align-items-center justify-content-center text-center"`}>
			              <b>Action</b>
			            </div>*/}
			{
				selectedItem
					? <EditUser
						open={editForm} 
						setOpen={() => setEditForm( false )}
						setEdit={handleEditForm} 
						fetchSchoolYears={fetchSchoolYears}
						{ ...selectedItem }
					/>
					: null
			}
			<AddUser 
				open={addForm} 
				setOpen={handleAddForm}
				setEdit={handleEditForm} 
				fetchSchoolYears={fetchSchoolYears}
			/>
			<div style={{ position: 'absolute', bottom: '15px', right: '15px' }}>
				<IconButton style={{ backgroundColor: 'rgba(25, 25, 21, 0.9)' }} onClick={handleAddForm}>
					<AddIcon style={{ color: 'white' }}/>
				</IconButton>
			</div>
		</>
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
				years[ 0 ] === years[ 1 ] || Number( years[ 0 ] ) + 1 !== Number( years[ 1 ] )
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
			    		<TextField
							key={uniqid()}
							label="School Year"
							variant="outlined"
							defaultValue={item.schoolYear}
							onChange={e => dispatch({ type: 'schoolYear', data: e.target.value })}
							placeholder="Ex: 2018-2019"
						/>
						<Autocomplete
							defaultValue={item.semester}
							options={['1st', '2nd']}
							onChange={(_, val) => dispatch({ type: 'semester', data: val })}
							renderInput={(params) => <TextField {...params} label="Semester"/>}
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
								axios.post(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/create-school-year`, { ...item })
								.then(() => {
									props.fetchSchoolYears();
									props.setOpen();
									enqueueSnackbar('Successfully added a school year', { variant: 'success' });

									dispatch({ type: 'schoolYear', data: '' });
									dispatch({ type: 'semester', data: '' });
								})
								.catch( err => {
									console.log( err );
									enqueueSnackbar( err?.response?.data?.message ?? 'Please try again', { variant: 'error' });
								});
							}
							else{
								enqueueSnackbar('All fields must be filled up', { variant: 'error' });
							}
						}
						else{
							[ syError, semError ].forEach( error => {
								if( error?.length ){ 
									enqueueSnackbar( error, { variant: 'error' });
								}
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
		if( !value ) return 'School year is empty';

		try{
			const currentYear = new Date().getFullYear();
			const years = value.split('-');

			if( years[0].length > currentYear.length || ( years.length > 2 || years.length < 2 ) ||
				( isNaN( years[0] ) || isNaN( years[1] ) ) ||
				years[ 0 ] === years[ 1 ] || Number( years[ 0 ] ) + 1 !== Number( years[ 1 ] )
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
			    		<TextField
							key={uniqid()}
							label="School Year"
							variant="outlined"
							defaultValue={item.schoolYear}
							onChange={e => dispatch({ type: 'schoolYear', data: e.target.value })}
							placeholder="Ex: 2018-2019"
						/>
						<Autocomplete
							defaultValue={item.semester}
							options={['1st', '2nd']}
							onChange={(_, val) => dispatch({ type: 'semester', data: val })}
							renderInput={(params) => <TextField {...params} label="Semester"/>}
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
								axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/edit-school-year`, { ...item })
								.then(() => {
									props.fetchSchoolYears();
									props.setOpen();
									enqueueSnackbar('Successfully edited a school year and semester', { variant: 'success' });
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