import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import ChipList from './ChipList';
import logo from '../images/discipline.png';

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
	const { studentID, reportIndex } = useParams();

	const [studentData, setStudentData] = React.useState( null );
	const [otherMajorBehavior, setOtherMajorBehavior] = React.useState('');
	const [otherAdministrativeDecision, setOtherAdministrativeDecision] = React.useState('');

	const isChecked = (index, list, data) => {
		return data?.includes?.( list[ index ] );
	}

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

	const getStudentData = async () => {
		axios.get(`http://localhost:3000/student-report/${ studentID }`)
		.then( res => {
      setStudentData( res.data );

      const page = document.getElementById('print-page').innerHTML;

      document.body.innerHTML = page;
      window.print(); 
		})
		.catch( err => {
			throw err;
		});
	}

	React.useEffect(() => getStudentData(), []);

	React.useEffect(() => {
		if( studentData?.report?.[ reportIndex ]?.majorProblemBehavior?.length && studentData?.report?.[ reportIndex ]?.administrativeDecision?.length ){
			setOtherMajorBehavior( studentData?.report?.[ reportIndex ]?.majorProblemBehavior?.filter?.( item => !majorBehavior.includes( item ))[ 0 ] ) ;
			setOtherAdministrativeDecision( studentData?.report?.[ reportIndex ]?.administrativeDecision?.filter?.( item => !administrativeDecision.includes( item ))[ 0 ] );

			console.log(isChecked(0, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior));
		}
		
	}, [studentData]);


	React.useEffect(() => {
		console.log( otherMajorBehavior );
	}, [otherMajorBehavior]);

	return(
			<div id="print-page" style={{ width: '100%', height: '90%', overflowY: 'auto' }} className="d-flex flex-column align-items-center">
				<div className="col-12 px-5 d-flex flex-row justify-content-start align-items-center">
					<img id="discipline-logo" src={logo} alt="discipline office logo"/>
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
							<TextField disabled sx={{ width: '300px' }} value={studentData?.report?.[ reportIndex ]?.reportedBy ?? 'N/A'} label="Reported By" variant="standard"/>
							<TextField disabled sx={{ width: '300px' }} value={studentData?.report?.[ reportIndex ]?.role ?? 'N/A'} label="Title/Role" variant="standard"/>
						</Stack>
					</div>
					<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
						<Stack spacing={2}>
							<TextField disabled sx={{ width: '300px' }} value={studentData?.report?.[ reportIndex ]?.dateOfReport ?? 'N/A'} variant="standard"/>
							<TextField disabled sx={{ width: '300px' }} value={studentData?.report?.[ reportIndex ]?.incidentNo ?? 'N/A'} label="Incident no."  type="number" variant="standard"/>
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
							<TextField disabled sx={{ width: '300px' }} value={studentData?.report?.[ reportIndex ]?.studentName ?? 'N/A'} label="Student Name" variant="standard"/>
							<TextField disabled sx={{ width: '300px' }} value={renderDate(studentData?.report?.[ reportIndex ]?.dateOfIncident)} variant="standard"/>
						</Stack>
					</div>
					<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
						<Stack spacing={2}>
							<TextField disabled sx={{ width: '300px' }} value={studentData?.courseYrSection ?? 'N/A'} label="Course / Yr / Section" variant="standard"/>
							<TextField disabled sx={{ width: '300px' }} value={studentData?.report?.[ reportIndex ]?.timeOfIncident ?? 'N/A'} label="Time of Incident" variant="standard"/>
						</Stack>
					</div>
				</div>

				<div className="row d-flex flex-column justify-content-center align-items-center mb-5">
					<div className="col-md-12 p-3 d-flex justify-content-start align-items-start">
						<TextField disabled sx={{ width: '300px', margin: '10px' }} value={studentData?.student?.studentID ?? 'N/A'} label="Student ID" variant="standard"/>
					</div>

					<div className="col-md-12 p-3 d-flex justify-content-start align-items-start">
						<TextField disabled sx={{ width: '300px' }} value={studentData?.report?.[ reportIndex ]?.semester ?? 'N/A'} label="Semester" variant="standard"/>
					</div>

					<div className="col-md-12 p-3 d-flex justify-content-start align-items-start">
						<TextField disabled sx={{ width: '300px' }} value={studentData?.report?.[ reportIndex ]?.duty?.join?.(', ') ?? 'N/A'} label="Time of Incident" variant="standard"/>
					</div>

					<div className="col-md-12 d-flex justify-content-center align-items-center">
						<TextField disabled sx={{ width: '80vw', margin: '10px' }} value={studentData?.report?.[ reportIndex ]?.location ?? 'N/A'} label="Location" variant="standard"/>
					</div>

					<div className="col-md-12 d-flex justify-content-center align-items-center">
						<TextField disabled sx={{ width: '80vw', margin: '10px' }} value={studentData?.report?.[ reportIndex ]?.specificAreaLocation ?? 'N/A'} label="Specific Area of Location" variant="standard"/>
					</div>

					<div className="col-md-12 d-flex justify-content-center align-items-center">
						<TextField disabled sx={{ width: '80vw', margin: '10px' }} value={studentData?.report?.[ reportIndex ]?.additionalPersonInvolved ?? 'N/A'} label="Additional Person(s) Involved" variant="standard"/>
					</div>

					<div className="col-md-12 d-flex justify-content-center align-items-center">
						<TextField disabled sx={{ width: '80vw', margin: '10px' }} value={studentData?.report?.[ reportIndex ]?.witnesses ?? 'N/A'} label="Witnesses" variant="standard"/>
					</div>
				</div>

				<div className="d-flex flex-column justify-content-between align-items-center">
					<TextField
						disabled
						value={studentData?.report?.[ reportIndex ]?.incidentDescription ?? 'N/A'}
						sx={{ width: '80vw', margin: '50px' }}
						id="standard-multiline-flexible"
						label="Incident Description"
						multiline
						rows={3}
						variant="filled"
	        />

					<Root>
						<Divider/>
					</Root>

	        <TextField
						disabled
						value={studentData?.report?.[ reportIndex ]?.descriptionOfUnacceptable ?? 'N/A'}
						sx={{ width: '80vw', margin: '50px' }}
						id="standard-multiline-flexible"
						label="Description of Unacceptable / Unsafe Behavior or Conditions (If applicable)"
						multiline
						rows={3}
						variant="filled"
	        />

	        <TextField
						disabled
						value={studentData?.report?.[ reportIndex ]?.resultingActionExecuted ?? 'N/A'}
						sx={{ width: '80vw', margin: '50px' }}
						id="standard-multiline-flexible"
						label="Resulting Action Executed or Planned"
						multiline
						rows={3}
						variant="filled"
	        />
				</div>

				<div className="row container-fluid d-flex flex-column justify-content-center align-items-center">
					<div className="row col-12 d-flex flex-row justify-content-around align-items-center m-3">
						<div className="col-md-4 d-flex	justify-content-center	align-items-center">
							<TextField disabled sx={{ width: '7cm', margin: '5px' }} value={studentData?.report?.[ reportIndex ]?.employeeName ?? 'N/A'}  label="Faculty / Employee Name" variant="standard"/>
						</div>

						<div className="col-md-4 d-flex justify-content-center align-items-center">
							<TextField disabled sx={{ width: '7cm', margin: '5px' }} value={renderDate(studentData?.report?.[ reportIndex ]?.date1)} variant="standard"/>
						</div>
					</div>

					<div className="row col-12 d-flex flex-row justify-content-around align-items-center m-3">
						<div className="col-md-5 d-flex justify-content-center align-items-center">
							<TextField disabled sx={{ width: '7cm', margin: '5px' }} value={studentData?.report?.[ reportIndex ]?.chairpersonName}  label="Head / Chairperson Name" variant="standard"/>
						</div>

						<div className="col-md-5 d-flex justify-content-center align-items-center">
							<TextField disabled sx={{ width: '7cm', margin: '5px' }} value={renderDate(studentData?.report?.[ reportIndex ]?.date2)} variant="standard"/>
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

						{
							studentData
								? (
										<div className="row container-fluid">
											<div className="col-md-6">
												<FormControlLabel
													label={majorBehavior[ 0 ]}
													control={<Checkbox disabled checked={isChecked(0, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior)} {...label}/>}
												/>
											</div>
											<div className="col-md-6">
												<FormControlLabel
													label={majorBehavior[ 1 ]}
													control={<Checkbox disabled checked={isChecked(1, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior)} {...label}/>}
												/>
											</div>
											<div className="col-md-6">
												<FormControlLabel
													label={majorBehavior[ 2 ]}
													control={<Checkbox disabled checked={isChecked(2, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior)} {...label}/>}
												/>
											</div>
											<div className="col-md-6">
												<FormControlLabel
													label={majorBehavior[ 3 ]}
													control={<Checkbox disabled checked={isChecked(3, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior)} {...label}/>}
												/>
											</div>
											<div className="col-md-6">
												<FormControlLabel
													label={majorBehavior[ 4 ]}
													control={<Checkbox disabled checked={isChecked(4, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior)} {...label}/>}
												/>
											</div>
											<div className="col-md-6">
												<FormControlLabel
													label={majorBehavior[ 5 ]}
													control={<Checkbox disabled checked={isChecked(5, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior)} {...label}/>}
												/>
											</div>
											<div className="col-md-6">
												<FormControlLabel
													label={majorBehavior[ 6 ]}
													control={<Checkbox disabled checked={isChecked(6, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior)} {...label}/>}
												/>
											</div>
											<div className="col-md-6">
												<FormControlLabel
													label={majorBehavior[ 7 ]}
													control={<Checkbox disabled checked={isChecked(7, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior)} {...label}/>}
												/>
											</div>
											<div className="col-md-6">
												<FormControlLabel
													label={majorBehavior[ 8 ]}
													control={<Checkbox disabled checked={isChecked(8, majorBehavior, studentData?.report?.[ reportIndex ]?.majorProblemBehavior)} {...label}/>}
												/>
											</div>
											<div className="col-md-6">
												<OtherCheckBox value={otherMajorBehavior} />
											</div>
										</div>
									)
								: null
						}
					</div>			
				</div>
				<div className="row container-fluid d-flex flex-column justify-content-center align-items-center">
					<div className="col-md-12 px-5 d-flex justify-content-start align-items-start">
						<h5 className="text-uppercase"><b>administrative decision:</b></h5>
					</div>
					{
						studentData
							? (
									<div className="row col-md-12">
										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 0 ]}
												control={<Checkbox disabled checked={isChecked(0, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 1 ]}
												control={<Checkbox disabled checked={isChecked(1, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 2 ]}
												control={<Checkbox disabled checked={isChecked(2, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 3 ]}
												control={<Checkbox disabled checked={isChecked(3, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 4 ]}
												control={<Checkbox disabled checked={isChecked(4, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 5 ]}
												control={<Checkbox disabled checked={isChecked(5, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 6 ]}
												control={<Checkbox disabled checked={isChecked(6, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 7 ]}
												control={<Checkbox disabled checked={isChecked(7, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 8 ]}
												control={<Checkbox disabled checked={isChecked(8, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-md-4">
											<FormControlLabel
												label={administrativeDecision[ 9 ]}
												control={<Checkbox disabled checked={isChecked(9, administrativeDecision, studentData?.report?.[ reportIndex ]?.administrativeDecision)} {...label}/>}
											/>
										</div>

										<div className="col-5">
											<OtherCheckBox value={otherAdministrativeDecision}/>
										</div>
									</div>
								)
							: null
					}
				</div>
				
				<div className="col-12 d-flex justify-content-center align-items-center">
					<TextField
						disabled
						value={studentData?.report?.[ reportIndex ]?.initialActionGiven  ?? 'N/A'}
						sx={{ width: '80vw', margin: '50px' }}
						id="standard-multiline-flexible"
						label="Initial Action Given"
						multiline
						rows={3}
						variant="filled"
			        />
				</div>

				<div className="col-12 d-flex justify-content-center align-items-center">
					<TextField
						disabled
						value={studentData?.report?.[ reportIndex ]?.administrativeComment  ?? 'N/A'}
						sx={{ width: '80vw', margin: '50px' }}
						id="standard-multiline-flexible"
						label="Administrative Comments and/or Follow Up:"
						multiline
						rows={3}
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
			control={<Checkbox disabled checked={ props?.value?.length ? true : false } {...label}/>}
		/>
	);
}

export default PrintPaper;