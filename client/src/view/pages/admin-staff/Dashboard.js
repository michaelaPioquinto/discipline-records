import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import uniqid from 'uniqid';

import Typography from '@mui/material/Typography';
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

import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

import TableSkeleton from '../../../components/TableSkeleton';

const Item = props => {
  return(
    <>
      <div style={{ width: '100%' }} className="rounded item" onDoubleClick={() => props.onClick({ isOpen: true, item: {...props} })}>
        <Paper elevation={2} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
          <Stack 
            direction="row" 
            alignItems="center" 
          >
            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.studentID } </p>
            </div>

            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.firstName } </p>
            </div>

            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.lastname } </p>
            </div>

            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.middleName } </p>
            </div>

            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.course } </p>
            </div>

            <div style={{ height: '40px' }} className="col-2 text-center d-flex justify-content-center align-items-center">
              <p className="p-0 m-0"> { props.yearSection } </p>
            </div>            
          </Stack>
        </Paper>
      </div>
    </>
  );
}

const Dashboard = props => {
	// Fetch user data
	const [row, setRow] = React.useState([]);
  const [editForm, setEditForm] = React.useState({ isOpen: false, item: null }); 

	const fetchStudentData = async() => {
    axios.get('http://localhost:3000/student-data')
    .then( res => {
      if( res.data ){
        const modifiedData = res.data.map( datum => ({ id: datum._id, ...datum}));
        setRow( modifiedData );
      }
    })
    .catch( err => {
      console.log( err );
    });
  }

  const setOpen = () => {
    setEditForm({ isOpen: false, item: null });
  }

	React.useEffect(() => {
    fetchStudentData();
	}, []);


	return(
		<div style={{ width: '100%', height: 'fit-content' }}>
      <div style={{ width: '100%', height: '100%' }} className="d-flex flex-column justify-content-center align-items-start p-1">
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
                Student ID
              </p>
            </div>
            
            <div className="col-2 text-center">
              <p className="db-table-header-label m-0 p-0">
                First Name
              </p>
            </div>

            <div className="col-2 text-center">
              <p className="db-table-header-label m-0 p-0">
                Last Name
              </p>
            </div>

            <div className="col-2 text-center">
              <p className="db-table-header-label m-0 p-0">
                Middle Name
              </p>
            </div>

            <div className="col-2 text-center">
              <p className="db-table-header-label m-0 p-0">
                Course
              </p>
            </div>

            <div className="col-2 text-center">
              <p className="db-table-header-label m-0 p-0">
                Year & Section
              </p>
            </div>
          </Stack>
        </Paper>
        <div style={{ width: '100%', height: '100%' }}>
            <Stack spacing={1}>
              {
                row.map( item => (
                  <Item
                    key={uniqid()}
                    onClick={setEditForm}
                    {...item}
                  />
                ))
              }
            </Stack>
        </div>
        <StudentForm setOpen={setOpen} item={editForm.item} isOpen={editForm.isOpen} />
      </div>
		</div>
	);
}

const StudentForm = props => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();

  const [reportData, setReportData] = React.useState( null );

  React.useEffect(() => {
    const fetchStudentReport = async () => {
      if( !props.item ) return;

      axios.get(`http://localhost:3000/student-report/${ props.studentID }`)
      .then( res => {
        setReportData( res.data );
      })
      .catch( err => {
        setTimeout(() => fetchStudentReport(), 5000);
      });
    } 

    fetchStudentReport();
  }, [props.item]);

  return(
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={ props.isOpen }
        onClose={ props.setOpen }
        maxWidth="md"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Want to edit a this student?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can now edit these information.
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
                  disabled 
                  id="outlined-basic" 
                  label="Student ID" 
                  variant="outlined" 
                  defaultValue={reportData?.studentID ?? 'Fetching...'}
                />
                <TextField
                  disabled 
                  id="outlined-basic" 
                  label="Duty" 
                  variant="outlined" 
                  defaultValue={reportData?.duty ?? 'Fetching...'}
                />
                <TextField
                  disabled 
                  id="outlined-basic" 
                  label="Report" 
                  variant="outlined" 
                  defaultValue={reportData?.report ?? 'Fetching...'}
                />
                <TextField
                  disabled 
                  id="outlined-basic" 
                  label="Evidence" 
                  variant="outlined" 
                  defaultValue={reportData?.evidence ?? 'Fetching...'}
                />
                <TextField
                  disabled 
                  id="outlined-basic" 
                  label="Year" 
                  variant="outlined" 
                  defaultValue={reportData?.year ?? 'Fetching...'}
                />
                <TextField
                  disabled 
                  id="outlined-basic" 
                  label="Semester" 
                  variant="outlined" 
                  defaultValue={reportData?.semester ?? 'Fetching...'}
                />
              </Stack>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={ props.setOpen }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}


export default Dashboard;