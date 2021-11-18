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

const Item = props => {
  return(
    <>
      <div style={{ width: '100%' }} className="rounded">
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

	// const handleAddButton = () => { 
	// 	setOpenForm( openForm => !openForm );
	// }	

	// const handleEditButton = () => { 
	// 	setEditForm({ isOpen: false, item: null });
	// }

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


	// React.useEffect(() => {
	// 	if( deleteViol ){
	// 		let modifiedViolations = violationList.filter( viol => viol.id !== deleteViol.id );

	// 		if( modifiedViolations.length ){
	// 			setViolationList([ ...modifiedViolations ]);
	// 		}

	// 		setDeleteViol( null );
	// 	}
	// }, [deleteViol]);

	return(
		<div style={{ width: '100%', height: '80vh' }} className="p-3 d-flex flex-column">
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
		</div>
	)
}





export default Violation;