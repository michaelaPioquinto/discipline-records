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

import Table from '../../../components/Table';
import TableSkeleton from '../../../components/TableSkeleton';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

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
      <TableCell> { props.studentID } </TableCell>
      <TableCell> { props.firstName } </TableCell>
      <TableCell> { props.lastname } </TableCell>
      <TableCell> { props.middleName } </TableCell>
      <TableCell> { props.course } </TableCell>
      <TableCell> { props.yearSection } </TableCell>
    </TableRow>
  );
}


const Dashboard = props => {
	// Fetch user data
	const [accounts, setAccounts] = React.useState( [] );
  const [items, setItems] = React.useState( [] );
  const [editForm, setEditForm] = React.useState({ isOpen: false, item: null }); 
  const search = React.useContext( SearchContext );
  
  React.useEffect(() => {
    let renderedItem = [];

    accounts.forEach( acc => {
      if( acc.firstName.searchContain( search ) ){
        renderedItem.push( 
          <Item
            key={uniqid()}
            onClick={setEditForm}
            {...acc}
          />
        );
      }
    });

    setItems([...renderedItem]);
  }, [accounts, search]);

	const fetchStudentData = async() => {
    axios.get('http://localhost:3000/student-data')
    .then( res => {
      if( res.data ){
        const modifiedData = res.data.map( datum => ({ id: datum._id, ...datum}));
        setAccounts( modifiedData );
      }
    })
    .catch( err => {
      throw err;
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
        <Table
          style={{ width: '100%' }}
          maxHeight={ 500 }
          head={['Student ID', 'First Name', 'Last Name', 'Middle Name', 'Course', 'Year & Section']}
          content={ items }
        />
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
  const [reports, setReports] = React.useState([]);

  const fetchStudentReport = async () => {
    if( !props.item ) return;

    axios.get(`http://localhost:3000/student-report/${ props.item.studentID }`)
    .then( res => {
      setReportData( res.data );
    })
    .catch( err => {
      if( err?.response?.status ){
        switch( err?.response?.status ){
          case 404:
            props.setOpen();
            enqueueSnackbar( 'This student does not have a report yet.', { variant: 'warning' });       
            break;

          default:
            enqueueSnackbar( 'An error occured, please try again!', { variant: 'error' });       
            break;
        }
      }
      
      throw err;
    });
  } 

  React.useEffect(() => {
    if( reportData ){
      reportData.report.forEach( rep => {
        setReports( reports => [ ...reports, (
            <div key={uniqid()}>
                <Stack direction="column" spacing={2}>
                  <TextField
                      disabled 
                      id="outlined-basic" 
                      label={`Duty - ${ rep.semester }`} 
                      variant="outlined" 
                      defaultValue={rep?.duty?.join?.(', ')}
                  />
                  <TextField
                      disabled 
                      id="outlined-basic" 
                      label="Report" 
                      variant="outlined" 
                      defaultValue={rep?.incidentDescription}
                  />
                  {
                    rep?.images
                      ? (
                          <div className="container-fluid">
                            <Stack direction="column">
                              <div className="col-12">
                                <p><b>Evidence</b></p>
                              </div>
                              <div className="col-12">
                                <img 
                                  style={{ 
                                    imageRendering: 'pixelated', 
                                    width: '100%', 
                                    height: '100%' 
                                  }} 
                                  src={rep.images[0]} 
                                  alt="Evidence"
                                />
                              </div>
                            </Stack>
                          </div>
                        )
                      : (
                          <div className="container-fluid text-center">
                            <p> NO EVIDENCE </p>
                          </div>
                        )
                  }
                  <TextField
                    disabled 
                    id="outlined-basic" 
                    label="Semester" 
                    variant="outlined" 
                    defaultValue={rep?.semester}
                  />
                  <Divider/>
              </Stack>
            </div>
          )]);
      });
    }
  }, [reportData]);

  React.useEffect(() => fetchStudentReport(), [props.item]);

  return(
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={ props.isOpen }
        onClose={ () => {
          setReportData( null );
          props.setOpen();
        }}
        maxWidth="md"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"You are viewing " + (reportData?.student?.firstName ?? '') + "'s data"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are not allowed to modify these data.
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
                {
                  reportData
                    ? (
                      <>
                        <TextField
                          disabled 
                          id="outlined-basic" 
                          label="Student ID" 
                          variant="outlined" 
                          defaultValue={reportData?.student?.studentID}
                        />
                        <TextField
                          disabled 
                          id="outlined-basic" 
                          label="Year" 
                          variant="outlined" 
                          defaultValue={reportData?.student?.yearSection}
                        />
                      </>
                    )
                    : null

                }
                { reports }
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