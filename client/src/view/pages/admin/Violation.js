import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { useSnackbar } from 'notistack';

import Table from '../../../components/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import SearchContext from '../../../context/SearchContext';

const Item = props => {
	const [bgColor, setBgColor] = React.useState('white');
	
	return(
	  <TableRow 
			sx={{ backgroundColor: bgColor, transition: '.1s ease-in-out' }} 
			onPointerEnter={() => setBgColor('rgba(0, 0, 0, 0.2)')}
			onPointerLeave={() => setBgColor('white')}	  
	  	onDoubleClick={() => props.onClick({ isOpen: true, item: {...props} })}
	  >
	      <TableCell> { props.violationName } </TableCell>
	      <TableCell> { props.firstOffense } </TableCell>
	      <TableCell> { props.secondOffense } </TableCell>
	      <TableCell> { props.thirdOffense } </TableCell>
	  </TableRow>
	);
}

const Violation = props => {
	const [violationList, setViolationList] = React.useState( [] );
	const [list, setList] = React.useState( [] );
	const [openForm, setOpenForm] = React.useState( false );
	const [editForm, setEditForm] = React.useState({ isOpen: false, item: null });
	const [violation, setViolation] = React.useState( null );
	const [deleteViol, setDeleteViol] = React.useState( null );

	const search = React.useContext( SearchContext );

	const { enqueueSnackbar } = useSnackbar();
	
	const initViolation = id => ({
		id,
		violationName: '',
		firstOffense: '',
		secondOffense: '',
		thirdOffense: ''
	});

	const handleAddButton = () => { 
		setOpenForm( openForm => !openForm );
	}	

	const handleEditButton = () => { 
		setEditForm({ isOpen: false, item: null });
	}

	React.useEffect(() => {
		let renderedItem = [];

		violationList.forEach( viol => {
			if( viol.violationName.searchContain( search ) ){
				renderedItem.push( viol );
			}
		});

		setList([...renderedItem]);
	}, [violationList, search]);

	const fetchViolationList = async() => {
		axios.get('http://localhost:3000/violation-list')
		.then( res => {
			if( res.data?.length ){
				setViolationList( res.data.map( (viol, index) => ({ 
					id: index,
					...viol
				})));
			}
		})
		.catch( err => {
			setTimeout(() => fetchViolationList(), 5000);
		});
	}
	
	React.useEffect(() => {
		fetchViolationList();
	}, []);

	React.useEffect(() => {
		setViolation( initViolation( violationList.length ) );
	}, [violationList]);


	React.useEffect(() => {
		if( deleteViol ){
			let modifiedViolations = violationList.filter( viol => viol.id !== deleteViol.id );

			if( modifiedViolations.length ){
			}

			setDeleteViol( null );
		}
	}, [deleteViol]);

	return(
		<div style={{ width: '100%', height: '80vh' }} className="p-3 d-flex flex-column">
      <Table
        style={{ width: '100%' }}
        maxWidth={580}
        head={['Violation Name', 'First Offense', 'Second Offense', 'Third Offense']}
        content={
          list.map( item => (
            <Item
              key={uniqid()}
              onClick={setEditForm}
              {...item}
            />
          ))
        }
      />
      <ValidationEditForm 
				setDelete={setDeleteViol} 
				editForm={editForm} 
				setViolationList={setViolationList} 
				setOpen={handleEditButton}
				fetchViolationList={fetchViolationList}
			/>
      { 
				violation && 
				<ValidationForm 
					setOpen={handleAddButton} 
					open={openForm} 
					setViolation={setViolation} 
					length={violationList.length}
					fetchViolationList={fetchViolationList}
				/> 
			}
			<div style={{ position: 'absolute', bottom: '15px', right: '15px' }}>
				<IconButton style={{ backgroundColor: 'rgba(25, 25, 21, 0.9)' }} onClick={handleAddButton}>
					<AddIcon style={{ color: 'white' }}/>
				</IconButton>
			</div>
		</div>
	)
}



const ValidationForm = props => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const { enqueueSnackbar } = useSnackbar();

	const [violationName, setViolationName] = React.useState('');
	const [firstOffense, setFirstOffense] = React.useState('');
	const [secondOffense, setSecondOffense] = React.useState('');
	const [thirdOffense, setThirdOffense] = React.useState('');

	const handleViolationName = async e => {
		setViolationName( e.target.value );
	}

	const handleFirstOffense = async e => {
		setFirstOffense( e.target.value );
	}

	const handleSecondOFfense = async e => {
		setSecondOffense( e.target.value );
	}

	const handleThirdOffense = async e => {
		setThirdOffense( e.target.value );
	}

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
					{"Want to add a violation?"}
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
								id="outlined-basic" 
								label="Violation" 
								variant="outlined" 
								onChange={handleViolationName}
							/>
							<TextField 
								id="outlined-basic" 
								label="First offense" 
								variant="outlined" 
								onChange={handleFirstOffense}
							/>
							<TextField 
								id="outlined-basic" 
								label="Second offense" 
								variant="outlined" 
								onChange={handleSecondOFfense}
							/>
							<TextField 
								id="outlined-basic" 
								label="Third offense" 
								variant="outlined" 
								onChange={handleThirdOffense}
							/>
				    	</Stack>
				    </Box>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={ props.setOpen }>
						Discard
					</Button>
					<Button 
						onClick={async () => {
							if( violationName.length && firstOffense.length && secondOffense.length && thirdOffense.length ){
								await axios.post('http://localhost:3000/save-violation', { violationName, firstOffense, secondOffense, thirdOffense })
								.then(() => {
									props.fetchViolationList();
									enqueueSnackbar('Successfully added a violation', { variant: 'success' });
								})
								.catch( err => {
									enqueueSnackbar('Please try again!', { variant: 'error' });
								});

								props.setViolation( violation => ({ id: violation.id, violationName, firstOffense, secondOffense, thirdOffense }));
								props.fetchViolationList();
								return props.setOpen();
							}	
							else{
								enqueueSnackbar('Please complete the form.', { variant: 'error' });
							}
						}} autoFocus
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
	    </div>
	);
}


const ValidationEditForm = props => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const { enqueueSnackbar } = useSnackbar();

	const [violationName, setViolationName] = React.useState( '' );
	const [firstOffense, setFirstOffense] = React.useState( '' );
	const [secondOffense, setSecondOffense] = React.useState( '' );
	const [thirdOffense, setThirdOffense] = React.useState( '' );

	React.useEffect(() => {
		if( props.editForm.item ){
			setViolationName( props.editForm.item?.violationName );
			setFirstOffense( props.editForm.item?.firstOffense );
			setSecondOffense( props.editForm.item?.secondOffense );
			setThirdOffense( props.editForm.item?.thirdOffense );
		}
	}, [props.editForm]);

	const handleViolationName = async e => {
		setViolationName( e.target.value );
	}

	const handleFirstOffense = async e => {
		setFirstOffense( e.target.value );
	}

	const handleSecondOFfense = async e => {
		setSecondOffense( e.target.value );
	}

	const handleThirdOffense = async e => {
		setThirdOffense( e.target.value );
	}

	return(
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={props.editForm.isOpen}
				onClose={ props.setOpen }
				maxWidth="md"
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title">
					{"Want to edit a violation?"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You can now edit this violation.
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
								id="outlined-basic" 
								label="Violation" 
								variant="outlined" 
								defaultValue={violationName}
								onChange={handleViolationName}
							/>
							<TextField 
								id="outlined-basic" 
								label="First offense" 
								variant="outlined" 
								defaultValue={firstOffense}
								onChange={handleFirstOffense}
							/>
							<TextField 
								id="outlined-basic" 
								label="Second offense" 
								variant="outlined" 
								defaultValue={secondOffense}
								onChange={handleSecondOFfense}
							/>
							<TextField 
								id="outlined-basic" 
								label="Third offense" 
								variant="outlined" 
								defaultValue={thirdOffense}
								onChange={handleThirdOffense}
							/>
				    	</Stack>
				    </Box>
				</DialogContent>
				<DialogActions>
					<Button 
						autoFocus 
						onClick={() => {
							props.setDelete( props.editForm.item );
							props.setOpen();

							const handleDelete = async () => {
								axios.delete(`http://localhost:3000/delete-violation/${props.editForm.item._id}`)
								.then( res => {
									props.fetchViolationList();
									enqueueSnackbar('Successfully deleted violation', { variant: 'success' });
								})
								.catch(() => {
									setTimeout(() => handleDelete(), 5000);
								});
							}

							handleDelete();
						}}
					>
						Delete
					</Button>
					<Button autoFocus onClick={ props.setOpen }>
						Discard
					</Button>
					<Button 
						onClick={() => {
							if( violationName.length && firstOffense.length && secondOffense.length && thirdOffense.length ){
								const handleEdit = async () => {
									axios.put(`http://localhost:3000/edit-violation/${ props.editForm.item._id }`, { 
										item: {
											violationName,
											firstOffense,
											secondOffense,
											thirdOffense
										} 
									})
									.then(() => {
										props.fetchViolationList();
										enqueueSnackbar('Successfully edited violation', { variant: 'success' });
									})
									.catch(() => {
										setTimeout(() => handleEdit(), 5000);
									});
								}

								handleEdit();
								return props.setOpen();
							}	
							else{
								enqueueSnackbar('Please complete the form.', { variant: 'error' });
							}
						}} autoFocus
					>
						Update
					</Button>
				</DialogActions>
			</Dialog>
	    </div>
	);
}



export default Violation;