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

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

const Item = props => {
	const [archive, setArchive] = React.useState( props.archived );

	const handleArchive = e => {
		setArchive( archive => !archive );
		debouncedChangeStatus();
	}

	const changeStatus = async () => {
		axios.put('http://localhost:3000/archive-student', { 
			studentID: props.studentID 
		})
		.then(() => props.fetchAccounts())
		.catch( err => {
			setTimeout(() => changeStatus(), 5000);
		});
	}

	const debouncedChangeStatus = debounce(changeStatus, 500);

	return(
		<>
			<div id="account-item" style={{ width: '100%' }} className="rounded item" onDoubleClick ={() => props.onDoubleClick ({ editingMode: true, ...props })}>
				<Paper elevation={2} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
					<Stack 
						direction="row" 
						alignItems="center" 
						justifyContent="center"
						sx={{ height: '45px' }}
					>
						<div className="col-1">
							<p className="p-0 m-0"> { props.studentID } </p>
						</div>

						<div className="col-2">
							<p className="p-0 m-0"> { props.firstName } </p>
						</div>

						<div className="col-2">
							<p className="p-0 m-0"> { props.lastname } </p>
						</div>

						<div className="col-2">
							<p className="p-0 m-0"> { props.middleName } </p>
						</div>

						<div className="col-1">
							<p className="p-0 m-0"> { props.course } </p>
						</div>

						<div className="col-2">
							<p className="p-0 m-0"> { props.yearSection } </p>
						</div>

						<div className="col-2">
							{
								!archive
									? (
										<Button variant="outlined" onClick={handleArchive} startIcon={<ArchiveIcon fontSize="small"/>}>
											Archive
										</Button>
									)
									: (
										<Button 
											variant="outlined" 
											onClick={handleArchive} sx={{ color: 'black', borderColor: 'black' }} 
											startIcon={<UnarchiveIcon sx={{ color: 'black' }} 
											fontSize="small"/>}
										>
											Unarchive
										</Button>
									)
							}
						</div>
					</Stack>
				</Paper>
			</div>
		</>
	);
}

const Accounts = props => {
	const [accounts, setAccounts] = React.useState( [] );
	const [items, setItems] = React.useState( [] );
	const [addForm, setAddForm] = React.useState( false );
	const [selectedItem, setSelectedItem] = React.useState( null );
	const { enqueueSnackbar } = useSnackbar();

	const fetchAccounts = async () => {
		axios.get('http://localhost:3000/student-data')
		.then( res => {
			setAccounts( res.data );
		})
		.catch( err => {
			setTimeout(() => fetchAccounts(), 5000);
		});
	}

	React.useEffect(() => fetchAccounts(), []);

	React.useEffect(() => {
		let renderedItem = [];

		accounts.forEach( acc => {
			renderedItem.push( 
				<Item 
					key={uniqid()} 
					onDoubleClick ={handleEditForm} 
					fetchAccounts={fetchAccounts}
					{...acc}
				/> 
			);
		});

		setItems([...renderedItem]);
	}, [accounts]);

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

	return(
		<div style={{ width: '100%', height: '80vh', overflowX: 'auto'}} className="p-3 text-center">
			<Paper 
				elevation={3} 
				sx={{ 
					backgroundColor: 'rgba(0, 0, 0, 0.8)', 
					color: 'white',
					width: '100%', 
					height: '50px', 
					padding: '10px',
					marginBottom: '10px',
				}}
			>
				<Stack
					direction="row" 
					divider={
						<Divider 
							sx={{ width: 2, height: '30px !important' }} 
							orientation="vertical" 
							flexItem 
						/>
					} 
					justifyContent="center"
					alignItems="center"
				>	
					<div className="col-1">
						<Typography variant="h6">
							ID
						</Typography>
					</div>
					
					<div className="col-2">
						<Typography variant="h6">
							First Name
						</Typography>
					</div>
					
					<div className="col-2">
						<Typography variant="h6">
							Middle Name
						</Typography>
					</div>
					
					<div className="col-2">
						<Typography variant="h6">
							Last Name
						</Typography>
					</div>

					<div className="col-1">
						<Typography variant="h6">
							Course
						</Typography>
					</div>

					<div className="col-2">
						<Typography variant="h6">
							Year & Section
						</Typography>
					</div>

					<div className="col-2">
						<Typography variant="h6">
							Archive
						</Typography>
					</div>
				</Stack>
			</Paper>
			<div style={{ width: '100%', height: '90%', overflowY: 'auto' }}>
				<Stack spacing={1}>
					{ items }
				</Stack>
			</div>
			<AddUser 
				open={addForm} 
				setOpen={handleAddForm}
				setEdit={handleEditForm} 
				fetchAccounts={fetchAccounts} 
				{ ...selectedItem }
			/>
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

	const [studentID, setStudentID] = React.useState( props.studentID ?? '' );
	const [firstName, setFirstName] = React.useState( props.firstName ?? '' );
	const [lastName, setLastName] = React.useState( props.lastname ?? '' );
	const [middleName, setMiddleName] = React.useState( props.middleName ?? '' );
	const [password, setPassword] = React.useState( props.password ?? '' );
	const [yearSection, setYearSection] = React.useState( props.yearSection ?? '' );
	const [course, setCourse] = React.useState( props.course ?? '' );
	const [archived, setArchived] = React.useState( props.archived ?? false );

	const { enqueueSnackbar } = useSnackbar();

	const handleStudentID = async e => {
		setStudentID( e.target.value );
	}

	const handleFirstName = async e => {
		setFirstName( e.target.value );
	}

	const handleLastName = async e => {
		setLastName( e.target.value );
	}

	const handleMiddleName = async e => {
		setMiddleName( e.target.value );
	}

	const handleYearSection = async e => {
		setYearSection( e.target.value );
	}

	const handleCourse = async e => {
		setCourse( e.target.value );
	}

	const handlePassword = async e => {
		setPassword( e.target.value );
	}

	React.useEffect(() => {
		if( props.editingMode ){
			setStudentID( props.studentID );
			setFirstName( props.firstName );
			setLastName( props.lastname );
			setMiddleName( props.middleName );
			setPassword( props.password );
			setYearSection( props.yearSection );
			setCourse( props.course );
		}
		else{
			setStudentID( '' );
			setFirstName( '' );
			setLastName( '' );
			setMiddleName( '' );
			setPassword( '' );
			setYearSection( '' );
			setCourse( '' );
		}
	}, [props]);



	return(
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={props.open}
				onClose={ props.setOpen }
				maxWidth="md"
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title">
					{
						!props.editingMode
							? "Want to add a system administrator or an administrator staff?"
							: "Edit this account?"
					}
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
				    			studentID={studentID}
				    			firstName={firstName}
				    			lastName={lastName}
				    			middleName={middleName}
				    			course={course}
				    			yearSection={yearSection}
				    			password={password}
				    			handleStudentID={handleStudentID}
				    			handleFirstName={handleFirstName}
				    			handleLastName={handleLastName}
				    			handleMiddleName={handleMiddleName}
				    			handleCourse={handleCourse}
				    			handleYearSection={handleYearSection}
				    			handlePassword={handlePassword}
	    					/>
				    	</Stack>
				    </Box>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={ props.setOpen }>
						Discard
					</Button>
					{
						!props.editingMode
							? (
									<Button 
										autoFocus
										onClick={() => {
											axios.post('http://localhost:3000/create-student', { 
												studentID, 
												firstName, 
												lastname: lastName, 
												middleName, 
												password, 
												course, 
												yearSection,
												archived
											})
											.then(() => {
												props.fetchAccounts();
												props.setOpen();
												enqueueSnackbar('Successfully added a user', { variant: 'success' });
											})
											.catch(() => {
												enqueueSnackbar('Please try again', { variant: 'error' });
											});
										}}
									>
										Add
									</Button>
							)
							: (
								<>
									<Button 
										autoFocus
										onClick={() => {
											axios.delete(`http://localhost:3000/delete-student/${ studentID }`)
											.then(() => {
												props.fetchAccounts();
												props.setOpen();
												enqueueSnackbar('Successfully deleted a user', { variant: 'success' });
											})
											.catch(() => {
												enqueueSnackbar('Please try again', { variant: 'error' });
											});
										}}
									>
										Delete
									</Button>
									<Button 
										autoFocus
										onClick={() => {
											axios.put(`http://localhost:3000/edit-student/${ studentID }`, { 
												studentID, 
												firstName, 
												lastname: lastName, 
												middleName, 
												password, 
												course, 
												yearSection,
												archived
											})
											.then(() => {
												props.fetchAccounts();
												props.setOpen();
												enqueueSnackbar('Successfully edited a user', { variant: 'success' });
											})
											.catch(() => {
												enqueueSnackbar('Please try again', { variant: 'error' });
											});
										}}
									>
										Save
									</Button>
								</>
							)
					}
				</DialogActions>
			</Dialog>
	    </div>
	);
}


const GenerateInputFields = props => (
	<>
		<TextField 
			id="outlined-basic" 
			label="Student ID" 
			variant="outlined"
			value={props.studentID}
			onChange={props.handleStudentID}
		/>
		<TextField 
			id="outlined-basic" 
			label="First name" 
			variant="outlined"
			value={props.firstName}
			onChange={props.handleFirstName}
		/>
		<TextField 
			id="outlined-basic" 
			label="Last name" 
			variant="outlined"
			value={props.lastName}
			onChange={props.handleLastName}
		/>

		<TextField 
			id="outlined-basic" 
			label="Middle name" 
			variant="outlined"
			value={props.middleName}
			onChange={props.handleMiddleName}
		/>
		<TextField 
			id="outlined-basic" 
			label="password" 
			variant="outlined"
			value={props.password}
			onChange={props.handlePassword}
		/>
		<TextField 
			id="outlined-basic" 
			label="Course" 
			variant="outlined"
			value={props.course}
			onChange={props.handleCourse}
		/>
		<TextField 
			id="outlined-basic" 
			label="Year and Section" 
			variant="outlined"
			value={props.yearSection}
			onChange={props.handleYearSection}
		/>
	</>
)

export default Accounts;