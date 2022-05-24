import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import uniqid from 'uniqid';
import debounce from 'lodash.debounce';

import PrintPaper from '../../components/PrintPaper';
import TimeField from 'react-simple-timefield';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

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

import Table from '../../components/Table';
import TableSkeleton from '../../components/TableSkeleton';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Pagination from '@mui/material/Pagination';

import SearchContext from '../../context/SearchContext';
import ImageUpload from '../../components/ImageUpload';
import ChipList from '../../components/ChipList';

import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';

import TableV2 from '../../components/Table-v2';
import InputAdornment from '../../components/InputAdornment';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const Item = props => {
  const [bgColor, setBgColor] = React.useState('white');

  const renderFullName = () => {
    if( (!props?.firstName && !props?.lastname ) || !props?.middleName )
      return 'N/A';

    const middleName = props?.middleName ?? '';

    return (
      props.firstName + ' ' +
      middleName + ' ' +
      props.lastname 
    );
  }

  return(
    <TableRow
      sx={{ backgroundColor: bgColor, transition: '.1s ease-in-out' }} 
      onPointerEnter={() => setBgColor('rgba(0, 0, 0, 0.2)')}
      onPointerLeave={() => setBgColor('white')}
      onDoubleClick={() => props.onClick({ isOpen: true, item: {...props} })}
    >
      <TableCell> { props.studentID } </TableCell>
      <TableCell> { props ? renderFullName() : 'N/A' } </TableCell>
      <TableCell> { props.course } </TableCell>
      {
        props?.openReport 
          ? (
              <TableCell>
                <Button 
                  onClick={() => props.onReport({...props})}
                  onDoubleClick={e => e.stopPropagation()}
                  variant="outlined" 
                  sx={{ color: 'red', borderColor: 'red' }} 
                  startIcon={<ReportGmailerrorredIcon/>}
                >
                  add incident
                </Button>
              </TableCell>
            )
          : null
      }
    </TableRow>
  );
}


const Dashboard = props => {
  const restorePage = document.body.innerHTML;

	// Fetch user data
  const [head, setHead] = React.useState(['Student ID', 'Student Name', 'Course']);
	const [accounts, setAccounts] = React.useState( [] );
  const [items, setItems] = React.useState( [] );
  const [editForm, setEditForm] = React.useState({ isOpen: false, item: null });
  const [selected, setSelected] = React.useState( null );
  const [incidentNumber, setIncidentNumber] = React.useState( null );
  const [semester, setSemester] = React.useState( null );

  const search = React.useContext( SearchContext );
  
  const incrementIncidentNumber = () => {
    setIncidentNumber( incidentNumber => incidentNumber + 1 );
  }

  React.useEffect(() => {
    let renderedItem = [];
    
    //          <Item
    //             key={uniqid()}
    //             openReport={props?.role === 'adminstaff'}
    //             onClick={setEditForm}
    //             onReport={data => setSelected( data )}
    //             {...acc}
    //           />

    accounts.forEach( acc => {
      if( acc.status === 'activated' && acc.studentID.searchContain( search ) ){
        renderedItem.push( acc );
      }
    });

    setItems([...renderedItem ]);
  }, [accounts, search]);

  const fetchIncidentNumber = async() => {
    axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/incident-number`)
    .then( res => {
      setIncidentNumber( res.data + 1 );
    })
    .catch( err => {
      throw err;
    });
  }

	const fetchStudentData = async() => {
    axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/student-data`)
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

  const getSchoolYearAndSemester = async() => {
    axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/get-current-school-year-semester`)
    .then( res => {
      setSemester( res?.data?.semester + ' semester' );
    })
    .catch( err => {
      throw err;
    });
  }

	React.useEffect(() => {
    fetchStudentData();
    if( props?.role && props?.role === 'adminstaff' ){
      setHead(head => [...head, 'Action']);
    }
	}, []);

  React.useEffect(() => fetchIncidentNumber(), []);
  React.useEffect(() => getSchoolYearAndSemester(), []);

	return(
    <>
      <TableV2 
        items={items} 
        onClick={setEditForm} 
        userType={props?.role} 
        searchPlaceHolder="Student ID"
        setSearch={e => props?.getSearchContent?.( e )}
        generateRows={( index, style, props ) => {
          const renderFullName = item => {
              if( !item?.firstName && !item?.lastname )
                return null;

              const middleName = item?.middleName ?? '';

              return (
              item?.firstName + ' ' +
              middleName + ' ' +
              item?.lastname 
              );
          }

          const renderCourseYrSection = item => {
            // if( !item?.course || !item?.yearSection)
            //   return null;

            // return item?.course + ' ' + item?.yearSection;
            if( !item?.course ) return null;

            return item?.course;
          }

          return (
            <div 
              // id={uniqid()} 
              style={{ ...style }} 
              onClick={() => props.onClick({ isOpen: true, item: { ...props?.items?.[ index ] }})}
              className="table-v2-row col-12 d-flex"
            > 
              <div 
                style={{
                  borderRight: '1px solid rgba(0, 0, 0, 0.1)'
                }} 
                className={`${props?.userType === 'adminstaff' ? 'col-3' : 'col-4'} d-flex align-items-center justify-content-center text-center"`}
              >
                { props?.items?.[ index ]?.studentID }
              </div>
              <div className={`${props?.userType === 'adminstaff' ? 'col-3' : 'col-4'} d-flex align-items-center justify-content-center text-center"`}>
                { renderFullName( props?.items?.[ index ] ) }
              </div>
              <div 
                style={{
                  borderLeft: '1px solid rgba(0, 0, 0, 0.1)'
                }} 
                className={`${props?.userType === 'adminstaff' ? 'col-3' : 'col-4'} d-flex align-items-center justify-content-center text-center"`}
              >
                { props?.items?.[ index ]?.course }
              </div>
              {
                props?.userType === 'adminstaff'
                  ? <div 
                      style={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.1)'
                      }} 
                      className="col-3 d-flex align-items-center justify-content-center"
                    >
                      <Button 
                        onClick={e => {
                          e.stopPropagation();
                          setSelected({ ...props?.items?.[ index ] });
                        }}
                        onDoubleClick={e => e.stopPropagation()}
                        variant="outlined" 
                        size="small"
                        color="error"
                        startIcon={<ReportGmailerrorredIcon/>}
                      >
                        add incident
                      </Button>             
                  </div>
                  : null
              }
            </div>
          )
        }}
        generateHeader={props => (
          <>
            <div className={`${props?.userType === 'adminstaff' ? 'col-3' : 'col-4'} d-flex align-items-center justify-content-center text-center"`}>
              <b>Student ID</b>
            </div>
            <div className={`${props?.userType === 'adminstaff' ? 'col-3' : 'col-4'} d-flex align-items-center justify-content-center text-center"`}>
              <b>Full Name</b>
            </div>
            <div className={`${props?.userType === 'adminstaff' ? 'col-3' : 'col-4'} d-flex align-items-center justify-content-center text-center"`}>
              <b>Course</b>
            </div>
            {
              props?.userType === 'adminstaff'
                ? <div className="col-3 d-flex align-items-center justify-content-center">
                  <b>Action</b>
                </div>
                : null
            }
          </>
        )}
      />
      <StudentForm 
        role={props?.tools?.role}
        setOpen={setOpen} 
        role={props?.role}
        item={editForm?.item} 
        isOpen={editForm.isOpen}
        restorePage={restorePage} 
      />
      { 
        selected 
          ? <MakeReportForm 
              semester={semester}
              data={selected} 
              setOpen={() => setSelected( null )} 
              isOpen={ selected ? true : false }
              incidentNumber={ incidentNumber }
              incrementIncidentNumber={incrementIncidentNumber}
            /> 
          : null 
      }
  		{/*<div style={{ width: '100%', height: 'fit-content' }}>
        <div style={{ width: '100%', height: '100%' }} className="d-flex flex-column justify-content-center align-items-start p-1">
          <Table
            style={{ width: '100%' }}
            maxHeight={ 500 }
            head={head}
            content={ items }
          />
          
        </div>
  		</div>
    */}
    </>
	);
}

const StudentForm = props => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();

  const [printPaper, setPrintPaper] = React.useState( null );
  const [reportData, setReportData] = React.useState( null );
  const [reports, setReports] = React.useState( [] );
  const [page, setPage] = React.useState( 1 );
  const [yearSemester, setYearSemester] = React.useState( null );
  const [dutyHrs, setDutyHrs] = React.useState( props?.item?.dutyHrs );

  const fetchStudentReport = async () => {
    if( !props.item ) return;

    axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/student-report/${ props.item.studentID }`)
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

    axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/get-current-school-year-semester`)
    .then( res => {
      setYearSemester( res.data );
    })
    .catch( err => {
      
      throw err;
    });
  } 

  const handleDutyUpdate = () => {
    axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/duty-update/${ reportData?.report?.[ page - 1 ]?._id }`, { dutyHrs })
    .then(() => {
      enqueueSnackbar( 'Updated Duty', { variant: 'success' });       
    })
    .catch( err => {
      enqueueSnackbar( 'Please try again later', { variant: 'error' });       
    });
  }

  // const debouncedDutyUpdate = debounce( handleDutyUpdate, 1000 );

  const handleArchive = async ({ _id }) => {
    axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/archive-report/${ _id }`)
    .then(() => {
      fetchStudentReport();
    })
    .catch( err => {
      enqueueSnackbar( 'Please try again later', { variant: 'error' });       
    });
  }

  React.useEffect(() => {
    if( reportData ){
      const reports = [];

      reportData?.report?.forEach?.((rep, index) => {
        // if( !rep?.semester && !rep?.duty?.length &&
        //     !rep?.incidentDescription && !rep?.majorProblemBehavior?.length &&
        //     !rep?.initialActionGiven && !rep?.administrativeDecision?.length &&
        //     !rep?.administrativeComment
        //   ) 
        //   return;

        if( rep.status === 'activated' ){
          setDutyHrs( rep?.dutyHrs );
          reports.push(
              <div key={uniqid()}>
                  <Stack direction="column" spacing={2}>
                    { yearSemester?.semester &&
                      <TextField
                        disabled
                        id="outlined-basic"
                        label={`Duty - ${ yearSemester?.semester } semester`} 
                        variant="outlined" 
                        defaultValue={rep?.duty?.length ? rep?.duty?.join?.(', ') : ' ' }
                      />
                    }
                    {
                      props?.role === 'adminstaff'
                        ?  <TimeField 
                            value={rep?.dutyHrs} 
                            className="p-0"
                            input={
                              <InputAdornment 
                                required 
                                timeButtonsOff 
                                variant="outlined" 
                                for="time"
                                label="Duty hours"
                                disabled
                              />
                            } 
                            onChange={(_, value) => setDutyHrs( value )} 
                          />
                        : <TextField label="Duty hours" disabled value={rep?.dutyHrs}/>
                    }
                    
                    {
                      rep?.semester 
                        ? <TextField
                            disabled 
                            id="outlined-basic" 
                            label="Incident Description" 
                            variant="outlined" 
                            defaultValue={rep?.incidentDescription}
                          />
                        : null
                    }
                    {
                      rep?.images && rep?.images?.length
                        ? (
                            <div className="container-fluid">
                              <Stack direction="column">
                                <div className="col-12">
                                  <p><b>Evidence</b></p>
                                </div>
                                <div className="col-12 d-flex justify-content-center align-items-center">
                                  {/*<img 
                                    style={{ 
                                      imageRendering: 'pixelated', 
                                      width: '50%', 
                                      height: '50%' 
                                    }} 
                                    src={rep.images[0]} 
                                    alt="Evidence"
                                  />*/}
                                  <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                                    {
                                      rep?.images?.map( image => (
                                          <ImageListItem key={uniqid()}>
                                              <img
                                                src={image}
                                                // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                alt=""
                                                loading="lazy"
                                              />
                                          </ImageListItem>
                                        ))
                                    }
                                  </ImageList>
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

                    {/*{
                      yearSemester?.semester 
                        ? <TextField
                            disabled 
                            id="outlined-basic" 
                            label="Semester" 
                            variant="outlined" 
                            defaultValue={yearSemester?.semester}
                          />
                        : null
                    }*/}

                    {
                      rep?.majorProblemBehavior?.length && yearSemester?.semester
                        ? <Root>
                            <Divider textAlign="left">
                              <Chip label={`GRIEVANCE - ${ yearSemester.semester }`}/>
                            </Divider>
                          </Root>
                        : null
                    }
                    
                    {
                      rep?.minorProblemBehavior?.length
                        ? <TextField
                            sx={{ width: '100%', margin: '50px' }}
                            id="standard-multiline-flexible"
                            label={`Minor Problem Behavior`} 
                            multiline
                            disabled
                            rows={10}
                            variant="outlined" 
                            // defaultValue={rep?.minorProblemBehavior?.map?.( offense => {
                            //   if( rep?.thirdOffenses?.includes( offense ) ){
                            //     return `${offense}-(Third Offense)`;             
                            //   }
                            //   else if( rep?.secondOffenses?.includes( offense ) ){
                            //     return `${offense}-(Second Offense)`;
                            //   }
                            //   else if( rep?.firstOffenses?.includes( offense ) ){
                            //     return `${offense}-(First Offense)`;
                            //   }
                            //   else{
                            //     return offense;
                            //   }
                            // })?.join?.(', ')}
                            defaultValue={rep?.minorProblemBehavior}
                          />
                        : null
                    }

                    {
                      rep?.majorProblemBehavior?.length
                        ? <TextField
                            sx={{ width: '100%', margin: '50px' }}
                            id="standard-multiline-flexible"
                            label={`Major Problem Behavior`} 
                            multiline
                            disabled
                            rows={10}
                            variant="outlined" 
                            defaultValue={rep?.majorProblemBehavior?.map?.( offense => {
                              if( rep?.thirdOffenses?.includes( offense ) ){
                                return `${offense}-(Third Offense)`;             
                              }
                              else if( rep?.secondOffenses?.includes( offense ) ){
                                return `${offense}-(Second Offense)`;
                              }
                              else if( rep?.firstOffenses?.includes( offense ) ){
                                return `${offense}-(First Offense)`;
                              }
                              else{
                                return offense;
                              }
                            })?.join?.(', ')}
                          />
                        : null
                    }

                    {
                      rep?.initialActionGiven
                        ? <TextField
                            disabled 
                            id="outlined-basic" 
                            label={`Initial Action Given`} 
                            variant="outlined" 
                            defaultValue={rep?.initialActionGiven}
                          />
                        : null
                    }

                    {
                      rep?.administrativeDecision?.length
                        ? <TextField
                            disabled 
                            id="outlined-basic" 
                            label={`Administrative Decision`} 
                            variant="outlined" 
                            defaultValue={rep?.administrativeDecision}
                          />
                        : null
                    }

                    {
                      rep?.administrativeComment
                        ? <TextField
                            disabled 
                            id="outlined-basic" 
                            label={`Administrative Comment`} 
                            variant="outlined" 
                            defaultValue={rep?.administrativeComment}
                          />
                        : null
                    }
                    <div className="container-fluid d-flex justify-content-around align-items-center">
                      {
                        props?.role === 'adminstaff'
                          ? <>
                              <Button 
                                variant="outlined" 
                                onClick={() => {
                                  window.open(`/print-student-report/${reportData?.student?.studentID}/reportIndex/${index}`, '_blank');
                                }}
                              >
                                print
                              </Button>
                              <Button 
                                variant="outlined" 
                                onClick={() => rep ? handleArchive?.( rep ) : null}
                              >
                                Archive
                              </Button>
                            </>
                          : null
                      }
                    </div>
                    <Divider/>
                </Stack>
              </div>
            );
        }
      });

      setReports([ ...reports ]);
    }
    else{
      setReports( [] );
    }
  }, [reportData, yearSemester]);

  React.useEffect(() => fetchStudentReport(), [props.item]);

  return(
    <Dialog
      fullScreen={fullScreen}
      open={ props.isOpen }
      onClose={ () => {
        setReportData( null );
        setReports( [] );
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
          {
            props?.role === 'adminstaff'
              ? 'You can modify these data'
              : 'You are not allowed to modify these data'
          }
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
                reportData && yearSemester
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
                        label="School Year" 
                        variant="outlined" 
                        defaultValue={yearSemester?.schoolYear}
                      />
                      <Divider/>
                    </>
                  )
                  : null
              }
              {
                reports.length
                  ? (
                      <>
                        { reports[ page - 1 ] }
                        <div className="col-12 d-flex justify-content-center align-items-center">
                          <Pagination count={ reports.length } page={ page } onChange={(_, value) => setPage( value )}/>
                        </div>
                      </>
                    )
                  : null
              }
            </Stack>
          </Box>
      </DialogContent>
      <DialogActions>
        {
          props?.role === 'adminstaff'
            ? <Button 
                onClick={() => handleDutyUpdate()}
              >
                Save
              </Button>
            : null
        }
        <Button 
          autoFocus 
          onClick={() => {
            setReportData( null );
            setReports( [] );
            props.setOpen();
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const label = { inputProps: { 'aria-label': 'Checkbox violation' } };

const renderDate = date => {
  if( !date ) return '';

  const _parsedDate = new Date( date );
  const _date = _parsedDate.getDate();
  const _month = _parsedDate.getMonth() + 1;
  const _year = _parsedDate.getFullYear();

  return `${_year}-${_month}-${_date}`;
}

const dateNow = () => {
  let date = new Date();

  return renderDate( date );
}

const MakeReportForm = props => {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [button, setButton] = React.useState({ msg: 'Submit', isDisabled: false });
  
  const [currentTime, setCurrentTime] = React.useState('AM');
  const [otherMinor, setOtherMinor] = React.useState( '' );
  const [otherMajor, setOtherMajor] = React.useState( '' );
  const [otherDecision, setOtherDecision] = React.useState( '' );
  const [image, setImage] = React.useState( null );
  const [isAdminDecisionCheckboxDisabled, setIsAdminDecisionCheckboxDisabled] = React.useState( false );
  const [currentRadioInput, setCurrentRadioInput] = React.useState( '' );

  const renderFullName = () => {
    if( !props?.data?.firstName && !props?.data?.lastname )
      return null;

    const middleName = props?.data?.middleName ?? '';

    return (
      props?.data?.firstName + ' ' +
      middleName + ' ' +
      props?.data?.lastname 
    );
  }

  const renderCourseYrSection = () => {
    if( !props?.data?.course )
      return null;

    return props?.data?.course;
    // if( !props?.data?.course || !props?.data?.yearSection)
    //   return null;

    // return props?.data?.course + ' ' + props?.data?.yearSection;
  }

  const initState = {
    studentID: props?.data?.studentID ?? '',
    semester: props?.semester,
    reportedBy: '', 
    role: '', 
    duty: '',
    dateOfReport: `${dateNow().split('-')[1]}-${dateNow().split('-')[2]}-${dateNow().split('-')[0]}`, 
    incidentNo: props?.incidentNumber, 
    studentName: renderFullName() ?? '', 
    dateOfIncident: '', 
    courseYrSection: renderCourseYrSection() ?? '', 
    timeOfIncident: `00:00 ${currentTime}`, 
    location: '',
    dutyHrs: '00:00', 
    specificAreaLocation: '', 
    additionalPersonInvolved: '', 
    witnesses: '', 
    incidentDescription: '', 
    images: [],
    descriptionOfUnacceptable: '',
    resultingActionExecuted: '',
    employeeName: '',
    date1: dateNow() ?? '',
    chairpersonName: '',
    date2: dateNow() ?? '',
    minorProblemBehavior: [],
    majorProblemBehavior: [],
    initialActionGiven: '',
    administrativeDecision: [],
    administrativeComment: '',
  }

  const today = new Date().toISOString().split('T')[0];

  const reducer = (state, action) => {
    switch( action.type ){
      case 'studentID':
        state.studentID = action.data;
        return state;

      case 'semester':
        state.semester = action.data;
        return state;

      case 'reportedBy':
        state.reportedBy = action.data;
        return state;

      case 'role':
        state.role = action.data;   
        return state;

      case 'duty':
        state.duty = action.data;
        return state;

      case 'dateOfReport':
        state.dateOfReport = today;
        return state;

      case 'incidentNo':
        state.incidentNo = action.data;
        return state;

      case 'studentName':
        state.studentName = action.data;
        return state;

      case 'dateOfIncident':
        state.dateOfIncident = action.data;
        return state;

      case 'courseYrSection':
        state.courseYrSection = action.data;
        return state;

      case 'timeOfIncident':
        state.timeOfIncident = action.data;
        return state;

      case 'location':
        state.location = action.data;
        return state;

      case 'dutyHrs':
        state.dutyHrs = action.data;
        return state;

      case 'specificAreaLocation':
        state.specificAreaLocation = action.data;
        return state;

      case 'additionalPersonInvolved':
        state.additionalPersonInvolved = action.data;
        return state;

      case 'witnesses':
        state.witnesses = action.data;
        return state;

      case 'incidentDescription':
        state.incidentDescription = action.data;
        return state;

      case 'images':      
        state.images = action.data ? [ ...action.data.map(({ name }) => '/images/reports/' + name) ] : [];
        return state;

      case 'descriptionOfUnacceptable':
        state.descriptionOfUnacceptable = action.data;
        return state;

      case 'resultingActionExecuted':
        state.resultingActionExecuted = action.data;
        return state;

      case 'employeeName':
        state.employeeName = action.data;
        return state;

      case 'date1':
        state.date1 = today;
        return state;

      case 'chairpersonName':
        state.chairpersonName = action.data;
        return state;

      case 'date2':
        state.date2 = today;
        return state;

      case 'minorProblemBehavior':
        state.minorProblemBehavior = action.data;
        return state;

      case 'majorProblemBehavior':
        state.majorProblemBehavior = action.data;
        return state;

      case 'initialActionGiven':      
        state.initialActionGiven = action.data;
        return state;

      case 'administrativeDecision':
        state.administrativeDecision = action.data;
        return state;

      case 'administrativeComment':
        state.administrativeComment = action.data;
        return state;

      default:
        return state;
    }
  }

  const radioLabels = [
      'Suspension',
      'Dismissal',
      'Exclusion',
      'Expulsion',
    ];

  const handleSubmitReport = async() => {
    setButton({ msg: 'Loading', isDisabled: true });

    if( otherMajor.length ){
      dispatch({ type: 'majorProblemBehavior', data: [...state.majorProblemBehavior, otherMajor] });
    }

    if( otherMinor.length ){
      dispatch({ type: 'minorProblemBehavior', data: [...state.minorProblemBehavior, otherMinor] });
    }

    if( otherDecision.length ){
      dispatch({ type: 'administrativeDecision', data: [...state.administrativeDecision, otherDecision] });
    }

    setTimeout(() => {
      if( state.studentID.length && state.reportedBy.length && 
        state.role.length && state.duty.length &&
        state.dateOfReport.length && state.timeOfIncident.length &&
        state.location.length && state.dutyHrs.length && 
        state.specificAreaLocation.length &&
        state.incidentDescription && (state.minorProblemBehavior.length || (state.majorProblemBehavior.length && state.administrativeDecision.length))
        ){
        axios.post(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/save-report`, state)
        .then( async res => {
          if( image ){
            const formData = new FormData();

            image.forEach( img => {
              formData.append('reportImage[]', img );
            });

            try{
              await axios.post(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/save-report-image`, formData)
            }
            catch( err ){
              throw err;
            }       
          }

          props?.incrementIncidentNumber?.();
          enqueueSnackbar( res.data.message, { variant: 'success' });
          props.setOpen();
        })
        .catch( err => {
          enqueueSnackbar( err?.response?.data?.message ?? 'Please try again', { variant: 'error' });
        });
      }
      else{
        enqueueSnackbar( 'A required field is empty!', { variant: 'error' });
      }

      setButton({ msg: 'Submit', isDisabled: false });

      // if( state.studentID.length && state.reportedBy.length && 
      //   state.role.length && state.duty.length &&
      //   state.dateOfReport.length && state.timeOfIncident.length &&
      //   state.location.length && state.dutyHrs.length && 
      //   state.specificAreaLocation.length && state.administrativeDecision.length &&
      //   state.incidentDescription && ( state.minorProblemBehavior.length || state.majorProblemBehavior.length )
      //   ){
      //   axios.post(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/save-report`, state)
      //   .then( async res => {
      //     if( image ){
      //       const formData = new FormData();

      //       image.forEach( img => {
      //         formData.append('reportImage[]', img );
      //       });

      //       try{
      //         await axios.post(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/save-report-image`, formData)
      //       }
      //       catch( err ){
      //         throw err;
      //       }       
      //     }

      //     props?.incrementIncidentNumber?.();
      //     enqueueSnackbar( res.data.message, { variant: 'success' });
      //     props.setOpen();
      //   })
      //   .catch( err => {
      //     enqueueSnackbar( err?.response?.data?.message ?? 'Please try again', { variant: 'error' });
      //   });
      // }
      // else{
      //   enqueueSnackbar( 'A required field is empty!', { variant: 'error' });
      // }

      // setButton({ msg: 'Submit', isDisabled: false });
    }, 1000);
  }

  const makeVisibleStyle = {
    color: 'black',
    "input:disabled": {
      color: 'black !important'
    },
  };

  const handleMajorProblemBehavior = (e, value) => {
    const label = e.target.labels[0].innerText;
    const labelExists = state.majorProblemBehavior.includes( label );

    if( labelExists && !value ){
      const newList = state.majorProblemBehavior.filter( val => val !== label );
      dispatch({ type: 'majorProblemBehavior', data: newList });
    }
    else if( !labelExists && value ){
      const newList = state.majorProblemBehavior;
      newList.push( label );

      dispatch({ type: 'majorProblemBehavior', data: newList });
    }
  }

  const handleMinorProblemBehavior = (e, value) => {
    const label = e.target.labels[0].innerText;
    const labelExists = state.minorProblemBehavior.includes( label );

    if( labelExists && !value ){
      const newList = state.minorProblemBehavior.filter( val => val !== label );
      dispatch({ type: 'minorProblemBehavior', data: newList });
    }
    else if( !labelExists && value ){
      const newList = state.minorProblemBehavior;
      newList.push( label );

      dispatch({ type: 'minorProblemBehavior', data: newList });
    }
  }

  const handleAdministrativeDecision = (e, value) => {
    const label = e.target.labels[0].innerText;
    const labelExists = state.administrativeDecision.includes( label );

    if( e?.target?.value && radioLabels?.includes( e?.target?.value ) ){
      dispatch({ type: 'administrativeDecision', data: [ e?.target?.value ] });
      setCurrentRadioInput( e?.target?.value );
      setIsAdminDecisionCheckboxDisabled( true );
    }
    else{
      // setIsAdminDecisionCheckboxDisabled( false );

      if( labelExists && !value ){
        const newList = state.administrativeDecision.filter( val => val !== label );
        dispatch({ type: 'administrativeDecision', data: newList });
      }
      else if( !labelExists && value ){
        const newList = state.administrativeDecision;
        newList.push( label );

        dispatch({ type: 'administrativeDecision', data: newList });
      }
    }
  }

  const [state, dispatch] = React.useReducer( reducer, initState );

  return(
    <Dialog
      fullScreen={fullScreen}
      open={ props.isOpen }
      onClose={ () => {
        // setReportData( null );
        // setReports( [] );
        props.setOpen();
      }}
      maxWidth="xl"
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"REPORT " + props?.data?.lastname?.toUpperCase?.() }
      </DialogTitle>
      <DialogContent>
        {/*insert content here*/}
        <div style={{ width: '100%', height: '100%', overflowX: 'hidden' }} className="p-4">
          <div style={{ width: '100%', height: '90%', overflowY: 'auto', overflowX: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.8)' }} className="p-3 rounded d-flex flex-column align-items-center">
            <div className="col-12 px-5 d-flex flex-row justify-content-start align-items-center">
              <img id="discipline-logo" src="images/discipline.png" alt="discipline office logo"/>
              <div className="col-12 d-flex flex-column justify-content-start align-items-start p-5">
                <h4 className="text-uppercase">city college of tagaytay</h4>
                <h1 className="text-uppercase">student incident report</h1>
              </div>
            </div>
            <div className="container-fluid">
              <Divider/>
            </div>
            <div className="row container-fluid d-flex justify-content-around align-items-center">
              <div className="col-md-6 d-flex justify-content-center align-items-center my-5">
                <Stack spacing={2}>
                  <TextField required sx={{ width: '300px' }} label="Reported By" onChange={e => dispatch({ type: 'reportedBy', data: e.target.value })} variant="standard"/>
                  <TextField required sx={{ width: '300px' }} label="Title/Role" onChange={e => dispatch({ type: 'role', data: e.target.value })} variant="standard"/>
                </Stack>
              </div>
              <div className="col-md-6 d-flex justify-content-center align-items-center my-5">
                <Stack spacing={2}>
                  <TextField 
                    required 
                    sx={{ width: '300px', ...makeVisibleStyle }} 
                    defaultValue={today} 
                    disabled 
                    helperText="Date of Report" 
                    onChange={e => dispatch({ type: 'dateOfReport', data: e.target.value })} 
                    type="date" variant="standard"
                  />
                  <TextField disabled sx={{ width: '300px', ...makeVisibleStyle }} defaultValue={state.incidentNo} label="Incident no." onChange={e => dispatch({ type: 'incidentNo', data: e.target.value })} type="number" variant="standard"/>
                </Stack>
              </div>
            </div>
            
            <div style={{ color: 'white' }} className="col-11 bg-dark py-1 d-flex justify-content-center align-items-center rounded">
              <h6 className="text-uppercase p-0 m-0">
                student incident information
              </h6>
            </div>

            <div className="row container-fluid d-flex justify-content-around align-items-center">
              <div className="col-md-6 d-flex justify-content-center align-items-center my-5">
                <Stack spacing={2}>
                  <TextField disabled sx={{ width: '300px', ...makeVisibleStyle }} defaultValue={state.studentName} onChange={e => dispatch({ type: 'studentName', data: e.target.value })} label="Student Name" variant="standard"/>
                  <TextField required sx={{ width: '300px' }} onChange={e => dispatch({ type: 'dateOfIncident', data: e.target.value })} helperText="Date of Incident" type="date" variant="standard"/>
                </Stack>
              </div>
              <div className="col-md-6 d-flex justify-content-center align-items-center my-5">
                <Stack spacing={2}>
                  <TextField required disabled sx={{ width: '300px', ...makeVisibleStyle }} defaultValue={state.courseYrSection} onChange={e => dispatch({ type: 'courseYrSection', data: e.target.value })} label="Course" variant="standard"/>
                  <TimeField 
                    value="00:00" 
                    input={<InputAdornment required getTime={time => setCurrentTime( time )} for="time" label="Time of Incident"/>} 
                    onChange={(e, value) => dispatch({ type: 'timeOfIncident', data: `${value} ${currentTime}` })} 
                  />
                  {/*<InputAdornment required adornment="AM/PM" sx={{ width: '300px' }} onChange={e => dispatch({ type: 'timeOfIncident', data: e.target.value })} label="Time of Incident" variant="standard"/>*/}
                </Stack>
              </div>
            </div>

            <div className="row d-flex flex-column justify-content-center align-items-center mb-5">
              <div className="col-md-12 d-flex justify-content-start align-items-start">
                <TextField disabled sx={{ width: '300px', margin: '10px' }} defaultValue={state.studentID} required onChange={e => dispatch({ type: 'studentID', data: e.target.value })} label="Student ID" variant="standard"/>
              </div>

              <div className="col-md-12 d-flex justify-content-start align-items-start">
                <TextField disabled sx={{ width: '300px', margin: '10px' }} defaultValue={state.semester} required onChange={e => dispatch({ type: 'semester', data: e.target.value })} label="Semester" variant="standard"/>
              </div>

              <div className="col-md-12 d-flex justify-content-center align-items-center">
                <TextField required sx={{ width: '80vw', margin: '10px' }} onChange={e => dispatch({ type: 'location', data: e.target.value })} label="Location" variant="standard"/>
              </div>

              <div className="col-md-12 d-flex justify-content-center align-items-center">
                <TextField required sx={{ width: '80vw', margin: '10px' }} onChange={e => dispatch({ type: 'specificAreaLocation', data: e.target.value })} label="Specific Area of Location" variant="standard"/>
              </div>

              <div className="col-md-12 d-flex justify-content-center align-items-center">
                <TextField sx={{ width: '80vw', margin: '10px' }} onChange={e => dispatch({ type: 'additionalPersonInvolved', data: e.target.value })} label="Additional Person(s) Involved" variant="standard"/>
              </div>

              <div className="col-md-12 d-flex justify-content-center align-items-center">
                <TextField sx={{ width: '80vw', margin: '10px' }} onChange={e => dispatch({ type: 'witnesses', data: e.target.value })} label="Witnesses" variant="standard"/>
              </div>
            </div>

            <div className="d-flex flex-column justify-content-between align-items-center">
              <TextField
                sx={{ width: '80vw', margin: '50px' }}
                id="standard-multiline-flexible"
                label="Incident Description"
                multiline
                required 
                rows={10}
                onChange={e => dispatch({ type: 'incidentDescription', data: e.target.value })}
                variant="filled"
              />

              <Root>
                <Divider textAlign="left">
                  <Chip label="UPLOAD IMAGE"/>
                </Divider>
              </Root>
              
              <ImageUpload
                imageLimit={5}
                getImages={ data => {
                  dispatch({ type: 'images', data: data });
                  setImage( data );
                }}
              />  
              <br/>

              <Root>
                <Divider/>
              </Root>

              <TextField
                sx={{ width: '80vw', margin: '50px' }}
                id="standard-multiline-flexible"
                label="Description of Unacceptable / Unsafe Behavior or Conditions (If applicable)"
                multiline
                rows={10}
                onChange={e => dispatch({ type: 'descriptionOfUnacceptable', data: e.target.value })}
                variant="filled"
              />

              <TextField
                sx={{ width: '80vw', margin: '50px' }}
                id="standard-multiline-flexible"
                label="Resulting Action Executed or Planned"
                multiline
                rows={10}
                onChange={e => dispatch({ type: 'resultingActionExecuted', data: e.target.value })}
                variant="filled"
              />
            </div>

            <div className="row container-fluid">
              <div className="col-md-3 d-flex flex-row justify-content-around align-items-center m-3">
                <TextField required sx={{ width: '7cm', margin: '5px' }} onChange={e => dispatch({ type: 'employeeName', data: e.target.value })} label="Faculty / Employee Name" variant="standard"/>
              </div>

              <div className="col-md-3 d-flex flex-row justify-content-around align-items-center m-3">
                <TextField required sx={{ width: '7cm', margin: '5px' }} onChange={e => dispatch({ type: 'chairpersonName', data: e.target.value })} label="Head / Chairperson Name" variant="standard"/>
              </div>
            </div>

            <div className="col-12">
              <Root>
                  <Divider textAlign="left">
                    <Chip label="GRIEVANCE"/>
                  </Divider>
              </Root>
            </div>

            <div className="mt-5 row d-flex flex-row justify-content-center align-items-center mb-5">
              <div className="col-md-12 px-5 d-flex justify-content-start align-items-start">
                <h5 className="text-uppercase"><b>problem behavior:</b></h5>
              </div>


              <div className="px-5 row col-md-12 my-3 d-flex flex-column justify-content-center align-items-center">
                <div className="col-12">
                  <p className="text-uppercase">minors: <b className="text-danger">(Required if there is no major problem behavior)</b></p>
                </div>

                <RadioGroup defaultValue={state.minorProblemBehavior} onChange={handleMinorProblemBehavior}>
                  <div className="row container-fluid">
                    <div className="col-md-6">
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Not wearing prescribed school uniform"
                        value="Not wearing prescribed school uniform"
                      />
                      {/*<FormControlLabel
                        label="Not wearing prescribed school uniform"
                        control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">  
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Not wearing I.D"
                        value="Not wearing I.D"
                      />
                      {/*<FormControlLabel
                        label="Not wearing I.D"
                        control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">  
                      {/*<FormControlLabel
                        label="Dress Code"
                        control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
                      />*/}
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Dress Code"
                        value="Dress Code"
                      />
                    </div>
                    <div className="col-md-6">  
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Using vulgar words and rough behavior"
                        value="Using vulgar words and rough behavior"
                      />
                      {/*<FormControlLabel
                        control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">  
                      {/*<FormControlLabel
                        label="Dress Code"
                        control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
                      />*/}
                      <FormControlLabel 
                        label="Loitering"
                        value="Loitering"
                        control={<Radio/>} 
                      />
                    </div>
                    <div className="col-md-6"> 
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Littering"
                        value="Littering"
                      /> 
                      {/*<FormControlLabel
                        label="Dress Code"
                        control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">  
                      {/*<FormControlLabel
                        label="Careless / unauthorized use of school property"
                        control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
                      />*/}
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Careless / unauthorized use of school property"
                        value="Careless / unauthorized use of school property"
                      /> 
                    </div>
                    <div className="col-md-6">
                      <FormControlLabel
                        control={<Radio/>}
                        label="Unauthorized posting of announcements, posters and notices."
                        value="Unauthorized posting of announcements, posters and notices."
                      />
                      {/*<FormControlLabel
                        label="Littering"
                        control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    {/*<div className="col-md-6">
                      <OtherCheckBox onChange={value => setOtherMinor( value )}/>
                    </div>*/}
                  </div>
                </RadioGroup>
              </div>

              {/*================================================================================*/}

              <div className="px-5 row col-md-12 my-3 d-flex flex-column justify-content-center align-items-center">
                <div className="col-md-12">
                  <p className="text-uppercase">majors: (Automatic Office Referral)</p>
                </div>

                <RadioGroup defaultValue={state.minorProblemBehavior} onChange={handleMinorProblemBehavior}>
                  <div className="row container-fluid">
                    <div className="col-md-6">
                      {/*<FormControlLabel
                        label="Unauthorized posting of announcements, posters and notices."
                        control={<Checkbox onChange={handleMajorProblemBehavior} {...label}/>}
                      />*/}
                      <FormControlLabel 
                        label="Using another persons, ID/COR, lending of ID/COR"
                        value="Using another persons, ID/COR, lending of ID/COR"
                        control={<Radio/>} 
                      />
                    </div>

                    <div className="col-md-6">
                      {/*here*/}
                      {/*<FormControlLabel
                        control={<Checkbox onChange={handleMajorProblemBehavior} {...label}/>}
                        label="Unauthorized posting of announcements, posters and notices."
                      />*/}
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Forging, Falsifying or Tampering of any Academic, Official Records of Documents"
                        value="Forging, Falsifying or Tampering of any Academic, Official Records of Documents"
                      />
                    </div>
                    <div className="col-md-6">
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Unauthorized possession of examination materials, and other documents"
                        value="Unauthorized possession of examination materials, and other documents"
                      />
                      {/*<FormControlLabel
                        label="Forging, Falsifying or Tampering of any Academic, Official Records of Documents"
                        control={<Checkbox onChange={handleMajorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Having somebody else take an examination for another"
                        value="Having somebody else take an examination for another"
                      />
                      {/*<FormControlLabel
                        label="Unauthorized possession of examination materials, and other documents"
                        control={<Checkbox onChange={handleMajorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Cheating during examination"
                        value="Cheating during examination"
                      />
                      {/*<FormControlLabel
                        label="Having somebody else take an examination for another"
                        control={<Checkbox onChange={handleMajorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Plagiarism"
                        value="Plagiarism"
                      />
                      {/*<FormControlLabel
                        label="Plagiarism"
                        control={<Checkbox onChange={handleMajorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Grave act of disrespect"
                        value="Grave act of disrespect"
                      />
                      {/*<FormControlLabel
                        label="Cheating during examination"
                        control={<Checkbox onChange={handleMajorProblemBehavior} {...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Involvement in any form of attack to other person"
                        value="Involvement in any form of attack to other person"
                      />
                      {/*<FormControlLabel
                        label="Grave act of disrespect"
                        control={<Checkbox onChange={handleMajorProblemBehavior}{...label}/>}
                      />*/}
                    </div>
                    <div className="col-md-6">
                      <FormControlLabel 
                        control={<Radio/>} 
                        label="Bullying in any form"
                        value="Bullying in any form"
                      />
                      {/*<FormControlLabel
                        label="Involvement in any form of attack to other person"
                        control={<Checkbox onChange={handleMajorProblemBehavior}{...label}/>}
                      />*/}
                    </div>
                    {/*<div className="col-md-6">
                      <OtherCheckBox onChange={value => setOtherMajor( value )}/>
                    </div>*/}
                  </div>
                </RadioGroup>
                <div className="col-md-12">
                  <TextField required sx={{ width: '80vw', margin: '10px' }} onChange={e => dispatch({ type: 'duty', data: e.target.value })} label="Duty" variant="standard"/>
                </div>
                <div className="col-md-12">
                  <br/>
                  <TimeField 
                    value="00:00" 
                    className="p-0"
                    input={<InputAdornment required timeButtonsOff for="time" adornment="23hrs max" label="Duty Time"/>} 
                    onChange={(_, value) => dispatch({ type: 'dutyHrs', data: value })} 
                  />
                  {/*<InputAdornment 
                    width="80vw" 
                    required 
                    adornment="Format: 00 hrs/mns" 
                    value={state.dutyHrs ? null : state.dutyHrs} 
                    label="Duty Time" 
                    variant="standard"
                    onChange={e => dispatch({ type: 'dutyHrs', data: e.target.value })} 
                  />*/}
                </div>              
              </div>      
            </div>
            <div className="row container-fluid d-flex flex-column justify-content-center align-items-center">
              <div className="col-md-12 px-5 d-flex justify-content-start align-items-start">
                <h5 className="text-uppercase"><b>administrative decision: </b></h5>
                <p className="text-danger mx-2">(Required if there is a major problem behavior)</p>
              </div>
              <div className="row col-md-12">
                <div className="col-md-4">
                  <FormControlLabel
                    label="Conference w/ student"
                    control={
                      !isAdminDecisionCheckboxDisabled
                        ? <Checkbox onChange={handleAdministrativeDecision} {...label}/>
                        : <Checkbox key={uniqid()} disabled={true} checked={false}/>
                      }
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Parent contact"
                    control={
                      !isAdminDecisionCheckboxDisabled
                        ? <Checkbox onChange={handleAdministrativeDecision} {...label}/>
                        : <Checkbox key={uniqid()} disabled={true} checked={false}/>
                      }
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Detention"
                    control={
                      !isAdminDecisionCheckboxDisabled
                        ? <Checkbox onChange={handleAdministrativeDecision} {...label}/>
                        : <Checkbox key={uniqid()} disabled={true} checked={false}/>
                      }
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Community Service"
                    control={
                      !isAdminDecisionCheckboxDisabled
                        ? <Checkbox onChange={handleAdministrativeDecision} {...label}/>
                        : <Checkbox key={uniqid()} disabled={true} checked={false}/>
                      }
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Oral Reprimand / Written Apology from the Students"
                    control={
                      !isAdminDecisionCheckboxDisabled
                        ? <Checkbox onChange={handleAdministrativeDecision} {...label}/>
                        : <Checkbox key={uniqid()} disabled={true} checked={false}/>
                      }
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Oral and Written Reprimand / Written Apology from the Students and Counselling"
                    control={
                      !isAdminDecisionCheckboxDisabled
                        ? <Checkbox onChange={handleAdministrativeDecision} {...label}/>
                        : <Checkbox key={uniqid()} disabled={true} checked={false}/>
                      }
                  />
                </div>

                <div className="col-5">
                  <OtherCheckBox disabled={isAdminDecisionCheckboxDisabled} onChange={value => setOtherDecision( value )}/>
                </div>

                {/*<div className="col-md-4">
                  <FormControlLabel
                    label="Conference w/ student"
                    control={<Checkbox disabled={isAdminDecisionCheckboxDisabled} onChange={handleAdministrativeDecision} {...label}/>}
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Parent contact"
                    control={<Checkbox disabled={isAdminDecisionCheckboxDisabled} onChange={handleAdministrativeDecision} {...label}/>}
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Detention"
                    control={<Checkbox disabled={isAdminDecisionCheckboxDisabled} onChange={handleAdministrativeDecision} {...label}/>}
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Community Service"
                    control={<Checkbox disabled={isAdminDecisionCheckboxDisabled} onChange={handleAdministrativeDecision} {...label}/>}
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Oral Reprimand / Written Apology from the Students"
                    control={<Checkbox disabled={isAdminDecisionCheckboxDisabled} onChange={handleAdministrativeDecision} {...label}/>}
                  />
                </div>

                <div className="col-md-4">
                  <FormControlLabel
                    label="Oral and Written Reprimand / Written Apology from the Students and Counselling"
                    control={<Checkbox disabled={isAdminDecisionCheckboxDisabled} onChange={handleAdministrativeDecision} {...label}/>}
                  />
                </div>

                <div className="col-5">
                  <OtherCheckBox disabled={isAdminDecisionCheckboxDisabled} onChange={value => setOtherDecision( value )}/>
                </div>*/}
                  
                <div className="col-12 my-5">
                  <Divider/>
                </div>

                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={currentRadioInput}
                  onChange={handleAdministrativeDecision}
                >
                  <div className="col-md-4">
                    <FormControlLabel
                      value="Suspension"
                      label="Suspension"
                      control={<Radio />}
                    />
                  </div>

                  <div className="col-md-4">
                    <FormControlLabel
                      value="Dismissal"
                      label="Dismissal"
                      control={<Radio />}
                    />
                  </div>

                  <div className="col-md-4">
                    <FormControlLabel
                      value="Exclusion"
                      label="Exclusion"
                      control={<Radio />}
                    />
                  </div>

                  <div className="col-md-4">
                    <FormControlLabel
                      value="Expulsion"
                      label="Expulsion"
                      control={<Radio />}
                    />
                  </div>
                </RadioGroup>
              </div>
              <Button 
                onClick={() => {
                  setCurrentRadioInput( '' );
                  setIsAdminDecisionCheckboxDisabled( false );
                  dispatch({ type: 'administrativeDecision', data: [] });
                }}
              >
                clear radio buttons
              </Button>
            </div>
            
            <div className="col-12 d-flex justify-content-center align-items-center">
              <TextField
                sx={{ width: '80vw', margin: '50px' }}
                id="standard-multiline-flexible"
                label="Initial Action Given"
                multiline
                rows={10}
                onChange={e => dispatch({ type: 'initialActionGiven', data: e.target.value })}
                variant="filled"
              />
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center">
              <TextField
                sx={{ width: '80vw', margin: '50px' }}
                id="standard-multiline-flexible"
                label="Administrative Comments and/or Follow Up:"
                multiline
                rows={10}
                onChange={e => dispatch({ type: 'administrativeComment', data: e.target.value })}
                variant="filled"
              />
            </div>

            <div className="d-flex justify-content-around align-items-center my-5">
              <Button disabled={button.isDisabled} variant="outlined" color="success" sx={{ width: '150px' }} onClick={() => handleSubmitReport()}>
                { button.msg }
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button 
          autoFocus 
          onClick={() => {
            // setReportData( null );
            // setReports( [] );
            props.setOpen();
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// const OtherCheckBox = props => {
//   const [isChecked, setIsChecked] = React.useState( false );
//   const [value, setValue] = React.useState('');
//   const [key, setKey] = React.useState( props?.key );

//   const handleChecked = e => {
//     setIsChecked( e.target.checked );
//   }

//   const handleOnChange = e => {
//     setValue( e.target.value );
//   }

//   const debouncedValuePassing = debounce(props?.onChange, 50);

//   React.useEffect(() => {
//     if( !isChecked ){
//       setValue( '' );
//     }

//     if( props.disabled ){
//       setIsChecked( false );
//     }

//     if( !value.length ){
//       props?.isEmpty?.( true );
//     }
//     else if( value.length ){
//       props?.isEmpty?.( false );
//     }

//     debouncedValuePassing?.( value, key );
//   }, [isChecked, value, props]);

//   return(
//     <FormControlLabel
//       label={
//         <TextField 
//           value={value} 
//           onChange={handleOnChange} 
//           label="Other"
//           variant="standard"
//           helperText={'Enter text here'}
//         />
//       }
//       value={value}
//       control={<Radio/>}
//     />
//   );
// }


const OtherCheckBox = props => {
  const [isChecked, setIsChecked] = React.useState( false );
  const [value, setValue] = React.useState('');
  const [key, setKey] = React.useState( props?.key );

  const handleChecked = e => {
    setIsChecked( e.target.checked );
  }

  const handleOnChange = e => {
    setValue( e.target.value );
  }

  const debouncedValuePassing = debounce(props?.onChange, 50);

  React.useEffect(() => {
    if( !isChecked ){
      setValue( '' );
    }

    if( props.disabled ){
      setIsChecked( false );
    }

    if( isChecked && !value.length ){
      props?.isEmpty?.( true );
    }
    else if( isChecked && value.length ){
      props?.isEmpty?.( false );
    }

    debouncedValuePassing?.( value, key );

  }, [isChecked, value, props]);

  return(
    <FormControlLabel
      label={
        <TextField 
          disabled={!isChecked} 
          value={value} 
          onChange={handleOnChange} 
          label="Other" 
          variant="standard"
          helperText={ isChecked ? 'Enter text here' : '' }
        />
      }
      control={
        !props?.disabled
          ? <Checkbox onChange={handleChecked} {...label}/>
          : <Checkbox key={uniqid()} checked={false} disabled={true} {...label}/>
      }
    />
  );
}


export default Dashboard;