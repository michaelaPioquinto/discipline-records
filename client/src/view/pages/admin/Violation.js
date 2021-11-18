import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
// import { DataGrid } from '@mui/x-data-grid';

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

const Item = props => {
  return(
    <>
      <div style={{ width: '100%' }} className="item rounded" onDoubleClick={() => props.onClick({ isOpen: true, item: {...props} })}>
        <Paper elevation={2} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
          <Stack 
            direction="row" 
            alignItems="center" 
          >
            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.id } </p>
            </div>

            <div style={{ height: '40px' }} className="col-4 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.violationName } </p>
            </div>

            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.firstOffense } </p>
            </div>

            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.secondOffense } </p>
            </div>

            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.thirdOffense } </p>
            </div>
          </Stack>
        </Paper>
      </div>
    </>
  );
}

const Violation = props => {
	const [violationList, setViolationList] = React.useState([]);
	const [content, setContent] = React.useState([]);
	const [openForm, setOpenForm] = React.useState( false );
	const [editForm, setEditForm] = React.useState({ isOpen: false, item: null });
	const [violation, setViolation] = React.useState( null );
	const [deleteViol, setDeleteViol] = React.useState( null );

	const { enqueueSnackbar } = useSnackbar();
	
	const initViolation = id => ({
		id,
		violationName: '',
		firstOffense: '',
		secondOffense: '',
		thirdOffense: ''
	});

	const setContentToNone = () => {
		setContent(
			<div className="d-flex justify-content-center align-items-center">
				<h3 style={{ color: 'rgba(0, 0, 0, 0.3)'}}>NO ITEMS YET</h3>
			</div>
		);
	}

	const handleAddButton = () => { 
		setOpenForm( openForm => !openForm );
	}	

	const handleEditButton = () => { 
		setEditForm({ isOpen: false, item: null });
	}

	const fetchViolationList = async() => {
		axios.get('http://localhost:3000/violation-list')
		.then( res => {
			if( res.data?.length ){
				setViolationList( res.data.map( (viol, index) => ({ 
					id: index,
					...viol
				})));
			}
			else{
				// setContentToNone();
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
		if( violationList.length ){
			setContent( null );
		}

		setViolation( initViolation( violationList.length ) );
	}, [violationList]);


	React.useEffect(() => {
		const saveViolation = async viol => {
			axios.post('http://localhost:3000/save-violation', viol )
			.then(() => {
				enqueueSnackbar('Successfully added violation', { variant: 'success' });
			})
			.catch(() => {
				setTimeout(() => saveViolation( viol ), 5000);
			});
		}

		if( violation && violation?.violationName?.length ){
			let isViolationExists = false;

			violationList.forEach( viol => {
				if( viol.violationName.toLowerCase() === violation.violationName.toLowerCase() ){
					isViolationExists = true;
					return enqueueSnackbar('Violation already exists', { variant: 'error' });
				}
			});

			if( !isViolationExists ){
				setViolationList( violationList => [...violationList, { ...violation } ]);
				saveViolation( violation );
				setViolation( initViolation( violationList.length ) );
			}
		}
	}, [violation]);


	React.useEffect(() => {
		if( deleteViol ){
			let modifiedViolations = violationList.filter( viol => viol.id !== deleteViol.id );

			if( modifiedViolations.length ){
				setViolationList([ ...modifiedViolations ]);
			}
			else{
				// setContentToNone();
			}

			setDeleteViol( null );
		}
	}, [deleteViol]);

	return(
		<div style={{ width: '100%', height: '80vh' }} className="p-3 d-flex flex-column">
			{ content }			
			<div style={{ position: 'absolute', bottom: '15px', right: '15px' }}>
				<IconButton style={{ backgroundColor: 'rgba(25, 25, 21, 0.9)' }} onClick={handleAddButton}>
					<AddIcon style={{ color: 'white' }}/>
				</IconButton>
			</div>
			<ValidationEditForm 
				setDelete={setDeleteViol} 
				editForm={editForm} 
				setViolationList={setViolationList} 
				setOpen={handleEditButton}
				fetchViolationList={fetchViolationList}
			/>
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
              sx={{ width: 2, alignSelf: 'stretch', height: '30px !important' }} 
              orientation="vertical" 
              flexItem 
            />
          } 
          spacing={0}
          alignItems="center"
        > 
          <div className="col-2 text-center">
            <p className="db-table-header-label m-0 p-0">
              ID
            </p>
          </div>
          
          <div className="col-4 text-center">
            <p className="db-table-header-label m-0 p-0">
              Violation Name
            </p>
          </div>

          <div className="col-2 text-center">
            <p className="db-table-header-label m-0 p-0">
              First Offense
            </p>
          </div>

          <div className="col-2 text-center">
            <p className="db-table-header-label m-0 p-0">
              Second Offense
            </p>
          </div>

          <div className="col-2 text-center">
            <p className="db-table-header-label m-0 p-0">
              third Offense
            </p>
          </div>
        </Stack>
      </Paper>
      <div style={{ width: '100%', height: '90%' }}>
          <Stack spacing={1}>
            {
              violationList.map( item => (
                <Item
                	key={uniqid()}
                  onClick={setEditForm}
                  {...item}
                />
              ))
            }
          </Stack>
      </div>
			{/*<DataGrid
				sx={{ height: '100%' }}
				columns={columns}
				rows={[...violationList]}
				pageSize={10}
				rowsPerPageOptions={[5]}
				onRowClick={e => setEditForm({ isOpen: true, item: e.row })}
			/>*/}
			{ 
				violation && 
				<ValidationForm 
					setOpen={handleAddButton} 
					open={openForm} 
					setViolation={setViolation} 
					length={violationList.length}
				/> 
			}
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
						onClick={() => {
							if( violationName.length && firstOffense.length && secondOffense.length && thirdOffense.length ){
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