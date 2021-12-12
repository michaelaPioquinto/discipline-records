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

const Item = props => {
	const [status, setStatus] = React.useState( props.status === 'activated' ? true : false );
	const [bgColor, setBgColor] = React.useState('white');

	const handleStatus = e => {
		setStatus( e.target.checked );
		debouncedChangeStatus( e );
	}

	const changeStatus = async e => {
		axios.put('http://localhost:3000/change-user-status', { 
			username: props.username, 
			status: e.target.checked ? 'activated' : 'deactivated' 
		})
		.then(() => props.fetchAccounts())
		.catch( err => {
			setTimeout(() => changeStatus(), 5000);
		});
	}

	const debouncedChangeStatus = debounce(changeStatus, 500);

	return(
		<TableRow 
			sx={{ backgroundColor: bgColor, transition: '.1s ease-in-out' }} 
			onPointerEnter={() => setBgColor('rgba(0, 0, 0, 0.2)')}
			onPointerLeave={() => setBgColor('white')}
			onDoubleClick ={() => props.onDoubleClick ({ editingMode: true, ...props })}
		>
			<TableCell> { props.username } </TableCell>
			<TableCell> ADMINISTRATOR </TableCell>
			<TableCell> 
				<FormControlLabel
					onDoubleClick={e => e.stopPropagation()}
					control={<Switch checked={status} onChange={handleStatus} onDoubleClick={e => e.stopPropagation()}/>} 
					label={ status ? 'Activated' : 'Deactivated' }
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

	const fetchAccounts = async () => {
		axios.get('http://localhost:3000/accounts/system-admin')
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
		<div style={{ width: '100%', height: '80vh' }} className="p-3 text-center">
			<Table
				maxHeight={ 500 }
				style={{ width: '100%' }}
				head={['Username', 'Role', 'Status']}
				content={ items }
			/>
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

	const [id, setID] = React.useState( null );
	const [firstname, setFirstname] = React.useState( props.firstname ?? '' );
	const [lastname, setLastname] = React.useState( props.lastname ?? '' );
	const [middlename, setMiddlename] = React.useState( props.middlename ?? '' );
	const [username, setUsername] = React.useState( props.username ?? '' );
	const [email, setEmail] = React.useState( props.email ?? '' );
	const [password, setPassword] = React.useState( props.password ?? '' );
	const [status, setStatus] = React.useState( props.status ?? 'activated' );

	const { enqueueSnackbar } = useSnackbar();

	const handleFirstName = async e => {
		setFirstname( e.target.value );
	}
	
	const handleLastName = async e => {
		setLastname( e.target.value );
	}

	const handleMiddleName = async e => {
		setMiddlename( e.target.value );
	}

	const handleName = async e => {
		setUsername( e.target.value );
	}

	const handleEmail = async e => {
		setEmail( e.target.value );
	}

	const handlePassword = async e => {
		setPassword( e.target.value );
	}

	React.useEffect(() => {
		if( props.editingMode ){
			setID( props._id );
			setFirstname( props.firstname );
			setLastname( props.lastname );
			setMiddlename( props.middlename );
			setUsername( props.username );
			setPassword( props.password );
			setEmail( props.email );
			setStatus( props.status );
		}
		else{
			setID( null );
			setFirstname( '' );
			setLastname( '' );
			setMiddlename( '' );
			setUsername( '' );
			setPassword( '' );
			setEmail( '' );
			setStatus( 'activated' );	
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
							? "Want to add a administrator"
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
		    					firstname={firstname}
		    					lastname={lastname}
		    					middlename={middlename}
		    					username={username ?? ''}
		    					password={password ?? ''}
		    					email={email ?? ''}
	    						handleFirstName={handleFirstName}
	    						handleLastName={handleLastName}
	    						handleMiddleName={handleMiddleName}
	    						handleName={handleName}
	    						handleEmail={handleEmail}
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
											if( username && firstname && lastname && middlename && password && status ){
												axios.post('http://localhost:3000/create-user/admin', { 
													firstname,
													lastname,
													middlename,
													username, 
													password, 
													status, 
													email, 
													role: 'admin' 
												})
												.then(() => {
													props.fetchAccounts();
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
											axios.delete(`http://localhost:3000/delete-user/id/${ id }`)
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
											if( id && firstname && lastname && middlename && username && password && status ){
												axios.post('http://localhost:3000/edit-user/admin', {
													id, 
													firstname,
													lastname,
													middlename,
													username, 
													password, 
													status, 
													email 
												})
												.then(() => {
													props.fetchAccounts();
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
			label="First Name" 
			variant="outlined"
			value={props.firstname}
			onChange={props.handleFirstName}
		/>
		<TextField 
			id="outlined-basic" 
			label="Middle Name" 
			variant="outlined"
			value={props.middlename}
			onChange={props.handleMiddleName}
		/>
		<TextField 
			id="outlined-basic" 
			label="Last Name" 
			variant="outlined"
			value={props.lastname}
			onChange={props.handleLastName}
		/>
		<TextField 
			id="outlined-basic" 
			label="Username" 
			variant="outlined"
			value={props.username}
			onChange={props.handleName}
		/>
		<TextField 
			id="outlined-basic" 
			label="Email" 
			variant="outlined"
			value={props.email}
			onChange={props.handleEmail}
		/>
		<TextField 
			id="outlined-basic" 
			label="password" 
			variant="outlined"
			value={props.password}
			onChange={props.handlePassword}
		/>
	</>
)

export default Accounts;