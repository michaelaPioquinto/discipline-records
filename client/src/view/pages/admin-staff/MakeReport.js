import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';

import ImageUpload from '../../../components/ImageUpload';
import ChipList from '../../../components/ChipList';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const renderDate = date => {
	if( !date ) return '';

	const _parsedDate = new Date( date );
	const _date = _parsedDate.getDate();
	const _month = _parsedDate.getMonth() + 1;
	const _year = _parsedDate.getFullYear();

	return `${_year}-${_month}-${_date}`;
}

const MakeReport = props => {
  const { enqueueSnackbar } = useSnackbar();
  const [button, setButton] = React.useState({ msg: 'Submit', isDisabled: false });

  const [image, setImage] = React.useState( null );
	const initState = {
		studentID: '',
		reportedBy: '', 
		role: '', 
		duty: [],
		dateOfReport: '', 
		incidentNo: '', 
		studentName: '', 
		dateOfIncident: '', 
		courseYrSection: '', 
		timeOfIncident: '', 
		location: '', 
		specificAreaLocation: '', 
		additionalPersonInvolved: '', 
		witnesses: '', 
		incidentDescription: '', 
		images: [],
		descriptionOfUnacceptable: '',
		resultingActionExecuted: '',
		employeeName: '',
		date1: '',
		chairpersonName: '',
		date2: ''
	}

	const reducer = (state, action) => {
		switch( action.type ){
			case 'studentID':
				state.studentID = action.data;
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
				state.dateOfReport = renderDate(action.data);
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
				state.courseYrSection = renderDate(action.data);
				return state;

			case 'timeOfIncident':
				state.timeOfIncident = action.data;
				return state;

			case 'location':
				state.location = action.data;
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
				state.images = action.data ? ['/images/reports/' + action.data.name] : [];
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
				state.date1 = renderDate( action.data );
				return state;

			case 'chairpersonName':
				state.chairpersonName = action.data;
				return state;

			case 'date2':
				state.date2 = renderDate( action.data );
				return state;

			default:
				return state;
		}
	}

	const handleSubmitReport = async() => {
		let isAllowed = true;

		setButton({ msg: 'Loading', isDisabled: true });

		Object.keys({ ...state}).forEach( key => {
			if( key !== 'images' && (!state[ key ] || !state[ key ].length) ){
				isAllowed = false;
			}
		});

		if( isAllowed ){
			axios.post('http://localhost:3000/save-report', state)
			.then( async res => {
				if( image ){
					const formData = new FormData();
					formData.append('reportImage', image );

					try{
						await axios.post(`http://localhost:3000/save-report-image`, formData)
					}
					catch( err ){
						throw err;
					}				
				}

				setButton({ msg: 'Submit', isDisabled: false });
				enqueueSnackbar( res.data.message, { variant: 'success' });
			})
			.catch( err => {
				throw err;
			});
		}
		else{
			setButton({ msg: 'Submit', isDisabled: false });
			return enqueueSnackbar( 'All fields must have a value', { variant: 'error' });
		}
	}

	const [state, dispatch] = React.useReducer( reducer, initState );

	return(
		<div style={{ width: '100%', height: '90%', overflowY: 'auto' }} className="d-flex flex-column align-items-center">
			<div className="col-12 d-flex flex-column justify-content-start align-items-start p-5">
				<h4 className="text-uppercase">city college of tagaytay</h4>
				<h1 className="text-uppercase">student incident report</h1>
			</div>
			<div className="container-fluid">
				<Divider/>
			</div>
			<div className="row container-fluid d-flex justify-content-around align-items-center">
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} label="Reported By" onChange={e => dispatch({ type: 'reportedBy', data: e.target.value })} variant="standard"/>
						<TextField sx={{ width: '300px' }} label="Title/Role" onChange={e => dispatch({ type: 'role', data: e.target.value })} variant="standard"/>
					</Stack>
				</div>
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} helperText="Date of Report" onChange={e => dispatch({ type: 'dateOfReport', data: e.target.value })} type="date" variant="standard"/>
						<TextField sx={{ width: '300px' }} label="Incident no." onChange={e => dispatch({ type: 'incidentNo', data: e.target.value })} type="number" variant="standard"/>
					</Stack>
				</div>
			</div>
			
			<div style={{ color: 'white' }} className="col-11 bg-dark py-1 d-flex justify-content-center align-items-center rounded">
				<h6 className="text-uppercase p-0 m-0">
					student incident information
				</h6>
			</div>

			<div className="row container-fluid d-flex justify-content-around align-items-center">
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} onChange={e => dispatch({ type: 'studentName', data: e.target.value })} label="Student Name" variant="standard"/>
						<TextField sx={{ width: '300px' }} onChange={e => dispatch({ type: 'dateOfIncident', data: e.target.value })} helperText="Date of Incident" type="date" variant="standard"/>
					</Stack>
				</div>
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} onChange={e => dispatch({ type: 'courseYrSection', data: e.target.value })} label="Course / Yr / Section" variant="standard"/>
						<TextField sx={{ width: '300px' }} onChange={e => dispatch({ type: 'timeOfIncident', data: e.target.value })} label="Time of Incident" variant="standard"/>
					</Stack>
				</div>
			</div>

			<div className="row d-flex flex-column justify-content-center align-items-center mb-5">
				<div className="col-md-12 d-flex justify-content-start align-items-start">
					<TextField sx={{ width: '300px', margin: '10px' }} onChange={e => dispatch({ type: 'studentID', data: e.target.value })} label="Student ID" variant="standard"/>
				</div>

				<div className="col-md-12">
					<ChipList 
						label="Add Duty"
						getValues={ data => dispatch({ type: 'duty', data: data ? data : [] })}
					/>
				</div>

				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} onChange={e => dispatch({ type: 'location', data: e.target.value })} label="Location" variant="standard"/>
				</div>

				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} onChange={e => dispatch({ type: 'specificAreaLocation', data: e.target.value })} label="Specific Area of Location" variant="standard"/>
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
					rows={10}
					maxRows={4}
					onChange={e => dispatch({ type: 'incidentDescription', data: e.target.value })}
					variant="filled"
        />

				<Root>
					<Divider textAlign="left">
						<Chip label="UPLOAD IMAGE"/>
					</Divider>
				</Root>
				
				<ImageUpload imageLimit={1} getImages={ data => {
					dispatch({ type: 'images', data: data?.[0] });
					setImage( data?.[0] );
				}}/>	
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
					maxRows={4}
					onChange={e => dispatch({ type: 'descriptionOfUnacceptable', data: e.target.value })}
					variant="filled"
        />

        <TextField
					sx={{ width: '80vw', margin: '50px' }}
					id="standard-multiline-flexible"
					label="Resulting Action Executed or Planned"
					multiline
					rows={10}
					maxRows={4}
					onChange={e => dispatch({ type: 'resultingActionExecuted', data: e.target.value })}
					variant="filled"
        />
			</div>

			<div className="row container-fluid d-flex flex-column justify-content-center align-items-center">
				<div className="row col-12 d-flex flex-row justify-content-around align-items-center m-3">
					<div className="col-md-4 d-flex	justify-content-center	align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} onChange={e => dispatch({ type: 'employeeName', data: e.target.value })} label="Faculty / Employee Name" variant="standard"/>
					</div>

					<div className="col-md-4 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} onChange={e => dispatch({ type: 'date1', data: e.target.value })} helperText="Date" type="date" variant="standard"/>
					</div>
				</div>

				<div className="row col-12 d-flex flex-row justify-content-around align-items-center m-3">
					<div className="col-md-5 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} onChange={e => dispatch({ type: 'chairpersonName', data: e.target.value })} label="Head / Chairperson Name" variant="standard"/>
					</div>

					<div className="col-md-5 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} onChange={e => dispatch({ type: 'date2', data: e.target.value })} helperText="Date" type="date" variant="standard"/>
					</div>
				</div>
			</div>
			<div className="d-flex justify-content-around align-items-center my-5">
				<Button disabled={button.isDisabled} variant="outlined" color="success" sx={{ width: '150px' }} onClick={() => handleSubmitReport()}>
				  { button.msg }
				</Button>
			</div>
		</div>
	);
}

export default MakeReport;