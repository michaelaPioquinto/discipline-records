import React from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import ChipList from './ChipList';
const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const label = { inputProps: { 'aria-label': 'Checkbox violation' } };

const renderDate = date => {
	if( !date ) return '';

	const _parsedDate = new Date( date );
	const _date = _parsedDate.getDate();
	const _month = _parsedDate.getMonth() + 1;
	const _year = _parsedDate.getFullYear();

	return `${_year}-${_month}-${_date}`;
}


const PrintPaper = props => {
	const [otherMajorBehavior, setOtherMajorBehavior] = React.useState('');
	const [otherAdministrativeDecision, setOtherAdministrativeDecision] = React.useState('');

	const majorBehavior = [
		"Using another persons, ID/COR, lending of ID/COR",
		"Forging, Falsifying or Tampering of any Academic, Official Records of Documents",
		"Unauthorized possession of examination materials, and other documents",
		"Having somebody else take an examination for another",
		"Cheating during examination",
		"Plagiarism",
		"Grave act of disrespect",
		"Involvement in any form of attack to other person",
		"Bullying in any form",
	]

	const administrativeDecision = [
		"Conference w/ student ",
		"Parent contact",
		"Detention",
		"Community Service",
		"Oral Reprimand / Written Apology from the Students",		
		"Oral and Written Reprimand / Written Apology from the Students and Counselling",
		"Suspension",
		"Dismissal",
		"Exclusion",
		"Expulsion",
	]

	React.useEffect(() => {
		if( props.majorProblemBehavior && props.administrativeDecision ){
			setOtherMajorBehavior( props?.majorProblemBehavior?.filter?.( item => !majorBehavior.includes( item ))[ 0 ] ) ;
			setOtherAdministrativeDecision( props?.administrativeDecision?.filter?.( item => !administrativeDecision.includes( item ))[ 0 ] );
		}
		
		console.log( props );
	}, [props]);

	return(
		<div id="print-page" style={{ display: 'none', width: '100%', height: '90%', overflowY: 'auto' }} className="d-flex flex-column align-items-center">
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
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} value={props.reportedBy} label="Reported By" variant="standard"/>
						<TextField sx={{ width: '300px' }} value={props.role} label="Title/Role" variant="standard"/>
					</Stack>
				</div>
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} value={props.dateOfReport} helperText="Date of Report"  type="date" variant="standard"/>
						<TextField sx={{ width: '300px' }} value={props.incidentNo} label="Incident no."  type="number" variant="standard"/>
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
						<TextField sx={{ width: '300px' }} value={props.studentName} label="Student Name" variant="standard"/>
						<TextField sx={{ width: '300px' }} value={renderDate(props.dateOfIncident)} helperText="Date of Incident" type="date" variant="standard"/>
					</Stack>
				</div>
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} value={props.courseYrSection} label="Course / Yr / Section" variant="standard"/>
						<TextField sx={{ width: '300px' }} value={props.timeOfIncident} label="Time of Incident" variant="standard"/>
					</Stack>
				</div>
			</div>

			<div className="row d-flex flex-column justify-content-center align-items-center mb-5">
				<div className="col-md-12 d-flex justify-content-start align-items-start">
					<TextField sx={{ width: '300px', margin: '10px' }} value={props.studentID} label="Student ID" variant="standard"/>
				</div>

				<div className="col-md-12 d-flex justify-content-start align-items-start">
					<TextField sx={{ width: '300px' }} value={props.timeOfIncident} label="Time of Incident" variant="standard"/>
				</div>

				<div className="col-md-12">
					<ChipList 
						value={props.duty}
						label="Add Duty"
					/>
				</div>

				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} value={props.location} label="Location" variant="standard"/>
				</div>

				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} value={props.specificAreaLocation} label="Specific Area of Location" variant="standard"/>
				</div>

				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} value={props.additionalPersonInvolved} label="Additional Person(s) Involved" variant="standard"/>
				</div>

				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} value={props.witnesses} label="Witnesses" variant="standard"/>
				</div>
			</div>

			<div className="d-flex flex-column justify-content-between align-items-center">
				<TextField
					value={props.incidentDescription}
					sx={{ width: '80vw', margin: '50px' }}
					id="standard-multiline-flexible"
					label="Incident Description"
					multiline
					rows={10}
					maxRows={4}
					variant="filled"
		        />

				<Root>
					<Divider/>
				</Root>

		        <TextField
					value={props.descriptionOfUnacceptable}
					sx={{ width: '80vw', margin: '50px' }}
					id="standard-multiline-flexible"
					label="Description of Unacceptable / Unsafe Behavior or Conditions (If applicable)"
					multiline
					rows={10}
					maxRows={4}
					variant="filled"
		        />

		        <TextField
					value={props.resultingActionExecuted}
					sx={{ width: '80vw', margin: '50px' }}
					id="standard-multiline-flexible"
					label="Resulting Action Executed or Planned"
					multiline
					rows={10}
					maxRows={4}
					variant="filled"
		        />
			</div>

			<div className="row container-fluid d-flex flex-column justify-content-center align-items-center">
				<div className="row col-12 d-flex flex-row justify-content-around align-items-center m-3">
					<div className="col-md-4 d-flex	justify-content-center	align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} value={props.employeeName}  label="Faculty / Employee Name" variant="standard"/>
					</div>

					<div className="col-md-4 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} value={renderDate(props.date1)}  helperText="Date" type="date" variant="standard"/>
					</div>
				</div>

				<div className="row col-12 d-flex flex-row justify-content-around align-items-center m-3">
					<div className="col-md-5 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} value={props.chairpersonName}  label="Head / Chairperson Name" variant="standard"/>
					</div>

					<div className="col-md-5 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} value={renderDate(props.date2)}  helperText="Date" type="date" variant="standard"/>
					</div>
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

				{/*<div className="px-5 col-md-5 my-3 d-flex flex-column justify-content-between align-items-start">
					<div className="col-12">
						<p className="text-uppercase">minors:</p>
					</div>

					<FormControlLabel
						label="Not wearing prescribed school uniform"
						control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
					/>
					
					<FormControlLabel
						label="Not wearing I.D"
						control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
					/>

					<FormControlLabel
						label="Dress Code"
						control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
					/>

					<FormControlLabel
						label="Using vulgar words and rough behavior"
						control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
					/>

					<FormControlLabel
						label="Loitering"
						control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
					/>

					<FormControlLabel
						label="Littering"
						control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
					/>

					<FormControlLabel
						label="Careless / unauthorized use of school property "
						control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
					/>

					<FormControlLabel
						label="Unauthorized posting of announcements, posters and notices."
						control={<Checkbox onChange={handleMinorProblemBehavior} {...label}/>}
					/>

					<OtherCheckBox onChange={value => setOtherMinor( value )}/>
				</div>*/}

				{/*================================================================================*/}

				<div className="px-5 row col-md-12 my-3 d-flex flex-column justify-content-center align-items-center">
					<div className="col-md-12">
						<p className="text-uppercase">majors: (Automatic Office Referral)</p>
					</div>

					<div className="row container-fluid">
						<div className="col-md-6">
							<FormControlLabel
								label={majorBehavior[ 0 ]}
								control={<Checkbox {...label}/>}
							/>
						</div>
						<div className="col-md-6">
							<FormControlLabel
								label={majorBehavior[ 1 ]}
								control={<Checkbox {...label}/>}
							/>
						</div>
						<div className="col-md-6">
							<FormControlLabel
								label={majorBehavior[ 2 ]}
								control={<Checkbox {...label}/>}
							/>
						</div>
						<div className="col-md-6">
							<FormControlLabel
								label={majorBehavior[ 3 ]}
								control={<Checkbox {...label}/>}
							/>
						</div>
						<div className="col-md-6">
							<FormControlLabel
								label={majorBehavior[ 4 ]}
								control={<Checkbox {...label}/>}
							/>
						</div>
						<div className="col-md-6">
							<FormControlLabel
								label={majorBehavior[ 5 ]}
								control={<Checkbox {...label}/>}
							/>
						</div>
						<div className="col-md-6">
							<FormControlLabel
								label={majorBehavior[ 6 ]}
								control={<Checkbox {...label}/>}
							/>
						</div>
						<div className="col-md-6">
							<FormControlLabel
								label={majorBehavior[ 7 ]}
								control={<Checkbox {...label}/>}
							/>
						</div>
						<div className="col-md-6">
							<FormControlLabel
								label={majorBehavior[ 8 ]}
								control={<Checkbox {...label}/>}
							/>
						</div>
						<div className="col-md-6">
							<OtherCheckBox value={otherMajorBehavior} />
						</div>
					</div>
				</div>			
			</div>
			<div className="row container-fluid d-flex flex-column justify-content-center align-items-center">
				<div className="col-md-12 px-5 d-flex justify-content-start align-items-start">
					<h5 className="text-uppercase"><b>administrative decision:</b></h5>
				</div>
				<div className="row col-md-12">
					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 0 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 1 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 2 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 3 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 4 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 5 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 6 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 7 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 8 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-md-4">
						<FormControlLabel
							label={administrativeDecision[ 9 ]}
							control={<Checkbox  {...label}/>}
						/>
					</div>

					<div className="col-5">
						<OtherCheckBox value={otherAdministrativeDecision}/>
					</div>
				</div>
			</div>
			
			<div className="col-12 d-flex justify-content-center align-items-center">
				<TextField
					sx={{ width: '80vw', margin: '50px' }}
					id="standard-multiline-flexible"
					label="Initial Action Given"
					multiline
					rows={10}
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
					variant="filled"
	        />
			</div>
		</div>
	);
}

const OtherCheckBox = props => {
	return(
		<FormControlLabel
			label={
				<TextField 
					value={props.value} 
					label="Other" 
					variant="standard"
				/>
			}
			control={<Checkbox checked={props.checked} {...label}/>}
		/>
	);
}

export default PrintPaper;