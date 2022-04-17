import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
import TableV2 from '../../components/Table-v2';

import { useSnackbar } from 'notistack';

import Table from '../../components/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Pagination from '@mui/material/Pagination';

import SearchContext from '../../context/SearchContext';

const Item = props => (
  <TableRow>
      <TableCell> { props.violationName } </TableCell>
      <TableCell> { props.firstOffense } </TableCell>
      <TableCell> { props.secondOffense } </TableCell>
      <TableCell> { props.thirdOffense } </TableCell>
  		<TableCell> 
	      {
	      	props?.role === 'admin'
	      		? <>
		      			<IconButton onClick={() => props?.handleEdit({ ...props })}>
		      				<EditIcon/>
				      	</IconButton>
				      	<IconButton onClick={() => props?.handleDelete( props?._id )}>
				      		<DeleteIcon/>
				      	</IconButton>
				      </>
				    : null
	      }
  		</TableCell>
  </TableRow>
);

const Violation = props => {
	const [violationList, setViolationList] = React.useState( [] );
	const [renderedViolations, setRenderedViolations] = React.useState( [] );
	const [list, setList] = React.useState( [] );
	const [openForm, setOpenForm] = React.useState( false );
	const [editForm, setEditForm] = React.useState({ isOpen: false, item: null });
	const [violation, setViolation] = React.useState( null );
	const [deleteViol, setDeleteViol] = React.useState( null );
	const [page, setPage] = React.useState( 1 );

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

	const handleEdit = val => { 
		setEditForm({ isOpen: true, item: val });
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
		axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/violation-list`)
		.then( res => {
				setViolationList( res.data.map((viol, index) => ({ 
					id: index,
					...viol
				})));
		})
		.catch( err => {
			setTimeout(() => fetchViolationList(), 5000);
		});
	}

	// const handleEditSave = ({ _id, violationName, firstOffense, secondOffense, thirdOffense }) => {
	// 	axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/edit-violation/id/${_id}`, { 
	// 		violationName, 
	// 		firstOffense, 
	// 		secondOffense, 
	// 		thirdOffense
	// 	})
	// 	.then(() => {
	// 		fetchViolationList();
	// 	})
	// 	.catch( err => {
	// 		throw err;
	// 	});
	// }

	const handleDelete = id => {
		axios.delete(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/delete-violation/${id}`)
		.then(() => {
			fetchViolationList();
		})
		.catch( err => {
			throw err;
		});
	}
	
	React.useEffect(() => {
		fetchViolationList();
	}, []);

	React.useEffect(() => {
		setViolation( initViolation( violationList.length ) );
	}, [violationList]);


	// React.useEffect(() => {
	// 	let filtered = [];
	// 	let chunkSet = [];
	// 	const chunksLimit = 7;

	// 	const addToFilteredItems = item => filtered.push( item );

	// 	violationList?.forEach?.( item => {
	// 		if( item?.violationName?.searchContain?.( search ) ){
	// 			addToFilteredItems( item );
	// 		}
	// 	});

	// 	if( violationList.length ){
	// 		let index = 0;
	// 		do{
	// 			const chunk = filtered.slice(index, index + chunksLimit);

	// 			chunkSet.push( chunk );	

	// 			index += chunksLimit;
	// 		}
	// 		while( chunkSet.length < Math.floor( filtered.length / chunksLimit ) + (filtered % chunksLimit === 0 ? 0 : 1 ));
	// 	}

	// 	setList([ ...chunkSet ]);
	// }, [violationList, search]);


	React.useEffect(() => {
		if( deleteViol ){
			let modifiedViolations = violationList.filter( viol => viol.id !== deleteViol.id );

			if( modifiedViolations.length ){
			}

			setDeleteViol( null );
		}
	}, [deleteViol]);

	return(
		<>
			{/*<div style={{ height: '90%', width: '100%'}}>
	      <Table
	        style={{ width: '100%' }}
	      	maxHeight={ 500 }
	        head={['Violation Name', 'First Offense', 'Second Offense', 'Third Offense', 'Action']}
	        content={list[ page - 1 ]}
	      />
			</div>
      <div stly={{ width: '100%', height: '10%' }} className="d-flex justify-content-center align-items-center">
    		<Pagination count={!list?.[ list?.length - 1 ]?.length ? list?.length - 1 : list?.length} onChange={(_, value) => setPage( value )} page={page}/>
      </div>*/}
      <TableV2 
      	items={list} 
      	userType={props?.role} 
      	setSearch={e => props?.getSearchContent?.( e )}
      	searchPlaceHolder="Violation Name"
      	handleEdit={handleEdit}
      	handleDelete={handleDelete}
      	generateRows={( index, style, props ) => {
      		return (
      			<div 
	            id={uniqid()} 
	            style={{ ...style }} 
	            className="table-v2-row col-12 d-flex"
	          > 
	            <div 
	              style={{
	                borderRight: '1px solid rgba(0, 0, 0, 0.1)'
	              }} 
	              className={`${props?.userType === 'admin' ? 'col-3' : 'col-3'} d-flex align-items-center justify-content-center text-center"`}
	            >
	              { props?.items?.[ index ]?.violationName }
	            </div>
	            <div className={`${props?.userType === 'admin' ? 'col-2' : 'col-3'} d-flex align-items-center justify-content-center text-center"`}>
	              { props?.items?.[ index ]?.firstOffense }
	            </div>
	            <div 
	              style={{
	                borderLeft: '1px solid rgba(0, 0, 0, 0.1)'
	              }} 
	              className={`${props?.userType === 'admin' ? 'col-2' : 'col-3'} d-flex align-items-center justify-content-center text-center"`}
	            >
	              { props?.items?.[ index ]?.secondOffense }
	            </div>
	            <div 
	              style={{
	                borderLeft: '1px solid rgba(0, 0, 0, 0.1)'
	              }} 
	              className={`${props?.userType === 'admin' ? 'col-3' : 'col-3'} d-flex align-items-center justify-content-center text-center"`}
	            >
	              { props?.items?.[ index ]?.thirdOffense }
	            </div>
	            {
				      	props?.userType === 'admin'
				      		? <div style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.1)' }} className="col-2 d-flex align-items-center justify-content-center text-center">
					      			<IconButton onClick={() => props?.handleEdit({ ...props.items[ index ] })}>
					      				<EditIcon/>
							      	</IconButton>
							      	<IconButton onClick={() => props?.handleDelete( props?.items[ index ]['_id'] )}>
							      		<DeleteIcon/>
							      	</IconButton>
							      </div>
							    : null
				      }
	          </div>
	        )
      	}}

      	generateHeader={props => (
      		<>
            <div className={`${props?.userType === 'admin' ? 'col-3' : 'col-3'} d-flex align-items-center justify-content-center text-center"`}>
              <b>Violation Name</b>
            </div>
            <div className={`${props?.userType === 'admin' ? 'col-2' : 'col-3'} d-flex align-items-center justify-content-center text-center"`}>
              <b>First Offense</b>
            </div>
            <div className={`${props?.userType === 'admin' ? 'col-2' : 'col-3'} d-flex align-items-center justify-content-center text-center"`}>
              <b>Second Offense</b>
            </div>
            <div className={`${props?.userType === 'admin' ? 'col-3' : 'col-3'} d-flex align-items-center justify-content-center text-center"`}>
              <b>Third Offense</b>
            </div>
            {
              props?.userType === 'admin'
                ? <div className="col-2 d-flex align-items-center justify-content-center">
	                  <b>Action</b>
	                </div>
                : null
            }
          </>
      	)}
      />
      <ValidationEditForm 
				setDelete={setDeleteViol} 
				editForm={editForm} 
				setViolationList={setViolationList} 
				setOpen={handleEditButton}
				// save={val => handleEditSave( val )}
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
			{
				props.role === 'admin'
					? <div style={{ position: 'absolute', bottom: '15px', right: '15px' }}>
							<IconButton style={{ backgroundColor: 'rgba(25, 25, 21, 0.9)' }} onClick={handleAddButton}>
								<AddIcon style={{ color: 'white' }}/>
							</IconButton>
						</div>
					: null
			}
		</>
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
								await axios.post(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/save-violation`, { violationName, firstOffense, secondOffense, thirdOffense })
								.then(() => {
									props.fetchViolationList();
									enqueueSnackbar('Successfully added a violation', { variant: 'success' });
								})
								.catch( err => {
									enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error' });
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
								axios.delete(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/delete-violation/${props.editForm.item._id}`)
								.then( res => {
									props.fetchViolationList();
									enqueueSnackbar('Successfully deleted violation', { variant: 'success' });
								})
								.catch(() => {
									enqueueSnackbar( 'Please try again!', { variant: 'error' });
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
									axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/edit-violation/${ props.editForm.item._id }`, { 
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
									.catch( err => {
										enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error' });
										// setTimeout(() => handleEdit(), 5000);
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