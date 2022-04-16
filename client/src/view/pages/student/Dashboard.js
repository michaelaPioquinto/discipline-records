import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';
import debounce from 'lodash.debounce';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import SummarizeIcon from '@mui/icons-material/Summarize';
import ContactMailIcon from '@mui/icons-material/ContactMail';

import SchoolYearAndSemester from '../../../context/SchoolYearAndSemester.js';


const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const CustomizedTextField = styled( TextField )({
	backgroundColor: 'rgba(255, 255, 255, 0.9)',
	border: 'none',
	borderRadius: '5px',
	color: 'black',
	".css-10botns-MuiInputBase-input-MuiFilledInput-input.Mui-disabled": {
		"-webkit-text-fill-color": 'rgba(0, 0, 0, 0.8)'
	},

	".Mui-disabled": {
		color: 'rgba(0, 0, 0, 0.7) !important'
	},
	// "input:disabled": {
	// 	color: 'rgba(0, 0, 0, 0.8) !important'
	// },
	// ".MuiFilledInput-input": {
	// 	color: 'red !important'
	// }
});

const Dashboard = props => {
	const selectedYearAndSem = React.useContext( SchoolYearAndSemester );
	const [studentData, setStudentData] = React.useState( null );
	const [reportsView, setReportsView] = React.useState( [] );
	const [reportPage, setReportPage] = React.useState( 1 );
	const [duties, setDuties] = React.useState( [] );
	const [dutyHrs, setDutyHrs] = React.useState( [] );

	const handleSwitchPage = ( _, value ) => {
		setReportPage( value );
	}

	const fetchStudentData = async () => {
		axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/student-report/${ props.name }`)
		.then( res => setStudentData( res.data ))
		.catch( err => {
			throw err;
		});
	}

	React.useEffect(() => { 
		if( props.name ) fetchStudentData();
	}, [props]);
	
	React.useEffect(() => {
		if( studentData && studentData?.report?.length ){
			const reps = [];
			const dtys = [];
			const dtyHrs = [];

			studentData.report.forEach( rep => {
				if( rep.status === 'deactivated' ) return;
				
				const yearStarted = Number(new Date().getFullYear().toString().slice( 0, 2 ) + studentData?.student?.studentID?.slice?.( 0, 2 ));

				const semester = selectedYearAndSem?.split?.('-')?.[ 2 ]?.replaceAll?.(' ', '') ?? '1stsemester' ;
				const year = selectedYearAndSem?.split?.(' ')?.[ 0 ]?.replaceAll?.(' ', '') ?? yearStarted;
				
				const reportYear = rep.schoolYear;

				const addToReps = currRep => {
					dtys.push( currRep.duty );
					dtyHrs.push( currRep.dutyHrs );

					reps.push( 
						<Report 
							key={ uniqid() } 
							{...currRep}
						/> 
					);
				}

				if( reportYear === year && rep.semester.replaceAll(' ', '') === semester ){
					addToReps( rep );
				}
			});

			if( !reps.length ){
				setDutyHrs( [] );
				setDuties( [] );
			}
			else{
				setDuties([ ...dtys ]);
				setDutyHrs([ ...dtyHrs ]);
			}

			setReportsView([ ...reps ]);
		}
	}, [studentData, selectedYearAndSem]);

	const renderFullName = () => {
		if( (!studentData?.student?.firstName && !studentData?.student?.lastname ) || !studentData?.student?.middleName )
			return 'N/A';

		const middleName = studentData?.student?.middleName ?? '';

		return (
			studentData?.student?.firstName + ' ' +
			middleName + ' ' +
			studentData?.student?.lastname 
		);
	}

	return(
		<div style={{ width: '100%', height: '100%', overflow: 'auto' }} className="m-0 py-5 px-2 d-flex flex-column justify-content-start align-items-center">
			<div className="col-12 pl-2 text-capitalize">
				<h1 style={{ letterSpacing: '5px' }}><b>Hello! {  (studentData?.student?.lastname ?? '') +', '+  (studentData?.student?.firstName ?? '') }</b></h1>
			</div>
			<div className="col-12">
				<Root>
					<Divider textAlign="left" sx={{ width: '100%', margin: '50px 0px 50px 0px'}}>
						<Chip icon={<ContactMailIcon fontSize="small"/>} sx={{ borderColor: 'black', padding: '0px 5px 0px 5px' }} variant="outlined" label="Your information"/>
					</Divider>
				</Root>
			</div>

			<div className="row col-12 d-flex flex-row justify-content-between">
				{/*<div className="col-md-12 my-2 d-flex justify-content-center align-items-center text-capitalize">
					<CustomizedTextField 
						disabled 
						label="Student Name" 
						variant="filled"
						value={studentData ? renderFullName() : null}
						sx={{ width: '100%' }}
					/>
				</div>*/}
				{/*<div className="col-md-3 my-2 d-flex justify-content-center align-items-center">
					<SkeletonizedTextfield label="Middle Name" data={studentData?.student?.middleName}/>
				</div>
				<div className="col-md-3 my-2 d-flex justify-content-center align-items-center">
					<SkeletonizedTextfield label="Last Name" data={studentData?.student?.lastname}/>
				</div>*/}
			</div>

			<div className="row col-12 d-flex flex-row justify-content-between">
				<div className="col-lg-3 my-2 d-flex justify-content-center align-items-center">
					<CustomizedTextField 
						disabled 
						label="Student Name" 
						variant="filled"
						value={studentData ? renderFullName() : ''}
						sx={{ width: '100%' }}
					/>
				</div>
				<div className="col-lg-3 my-2 d-flex justify-content-center align-items-center">
					<CustomizedTextField 
						disabled 
						label="Course" 
						variant="filled"
						value={studentData?.student?.course ?? ''}
						sx={{ width: '100%' }}
					/>
				</div>
				<div className="col-lg-3 my-2 d-flex justify-content-center align-items-center">
					<CustomizedTextField 
						disabled 
						label="Year & Section"
						variant="filled"
						value={studentData?.student?.yearSection ?? ''}
						sx={{ width: '100%' }}
					/>
				</div>
				<div className="col-lg-3 my-2 d-flex justify-content-center align-items-center">
					<CustomizedTextField 
						disabled 
						label="Semester" 
						variant="filled"
						value={studentData?.student?.semester ?? ''}
						sx={{ width: '100%' }}
					/>
				</div>
				<div className="col-md-5 my-2 d-flex justify-content-center align-items-center">
					<CustomizedTextField 
						disabled 
						label="Duty / Duties"
						variant="filled"
						value={duties?.[ reportPage - 1 ] ?? ''}
						sx={{ width: '100%' }}
					/>
				</div>
				<div className="col-md-5 my-2 d-flex justify-content-center align-items-center">
					<CustomizedTextField 
						disabled 
						label="Duty Hours"
						variant="filled"
						value={dutyHrs?.[ reportPage - 1 ] ?? ''}
						sx={{ width: '100%' }}
					/>
				</div>
			</div>

			<div className="col-12">
				<Root>
					<Divider textAlign="left" sx={{ width: '100%', margin: '50px 0px 10px 0px'}}>
						<Chip icon={<SummarizeIcon fontSize="small"/>} sx={{ borderColor: 'black', padding: '0px 5px 0px 5px' }} variant="outlined" label="Reports"/>
					</Divider>
				</Root>
			</div>
			<div className="col-12 d-flex justify-content-center align-items-center">
				<div style={{ position: 'relative', width: '100%', minWidth: '200px' }} className="pt-5 m-0">
					{
						studentData && studentData?.report?.length
							? (
									<>
										<div className="col-12 my-3 d-flex justify-content-center align-items-center">
											{ reportsView[ reportPage - 1 ] }
										</div>
										<div 
											style={{
												position: 'absolute',
												bottom: '10%',
												left: '50%',
												transform: 'translate(-50%, -90%)',
												width: 'fit-content',
												height: 'fit-content',
												backgroundColor: 'rgba(255, 255, 255, 0.4)',
											}}
											className="col-12 py-1 px-2 d-flex justify-content-center align-items-center"
										>
											<Pagination count={ reportsView.length } page={ reportPage } onChange={ handleSwitchPage }/>
										</div>
									</>
								)
							: (
									<div className="container-fluid text-center">
										<h4 className="p-0 m-0">
											<b className="p-0 m-0" style={{ color: 'rgba(0, 0, 0, 0.5)'}}>NO REPORTS</b>
										</h4>
									</div>
								)
					}	
				</div>
			</div>
		</div>
	);
}

const Report = props => {
	return(
		<div 
			style={{ 
				width: '100%', 
				height: '100%', 
				overflowY: 'auto', 
				border: '1px solid rgba(0, 0, 0, 0.5)',
				borderRadius: '5px',
				backgroundColor: 'rgba(255, 255, 255, 0.8)'
			}} 
			className="d-flex flex-column justify-content-between align-items-center"
		>
			<div className="py-3 col-12 d-flex justify-content-center align-items-center">
				<SkeletonizedTextfield 
					label="Violation" 
					data={ props.incidentDescription }
					width="90%"
				/>
			</div>
			<Divider sx={{ margin: '5px 0px 5px 0px', width: '100%' }}/>
			<div className="col-12 p-3 d-flex justify-content-center align-items-center" style={{ height: 'fit-content' }}>
				{
					props?.images?.length
						? <SkeletonizedImage images={ props.images } width="500px" height="500px"/>
						: <h1>NO EVIDENCE</h1>
				}
			</div>
		</div>	
	);
}

const getDuties = data => {
	const memo = [];

	data.forEach( datum => {
		datum.duty.forEach( duty => {
			if( !memo.includes( duty ) ){
				memo.push( duty );
			}
		});
	});

	return memo.join(', ');
}

const findSemester = data => {
	const { report, student } = data;

	let semester = '1st semester';
	let highestYear = -Infinity;
	let highestMonth = -Infinity;

	report.forEach( rep => {
		let dateData = rep.dateOfReport.split('-');
		let year = Number( dateData[ 0 ] );
		let month = Number( dateData[ 1 ] );

		if( year > highestYear ){
			highestYear = year;
			highestMonth = month

			semester = rep.semester;
		}
		else if( year === highestYear ){
			if( month > highestMonth ){
				highestMonth = month

				semester = rep.semester;
			}
		}
	});

	return semester;
}


const SkeletonizedTextfield = props => {
	const [state, setState] = React.useState('loading');
	const [content, setContent] = React.useState( <Skeleton width={ props.width ?? '100%' } height="100px" /> );

	React.useEffect(() => {
		if( props.data ){
			setState('ok');
		}
		else{
			setState('loading');

			setTimeout(() => setState('no data'), 5000);
		}
	}, [props]);

	React.useEffect(() => {
		// if( props.label === 'Duty / Duties') console.log( props.data );
		let refresh = null;
		
		if( state === 'ok' ){
			if( props.refresh ){
				refresh = setInterval(() => {
					setContent(() => (
						<CustomizedTextField 
							disabled={ props.disabled ?? true } 
							label={props.label} 
							variant="filled"
							value={props?.data}
							// defaultValue={typeof props?.data === Array ? props?.data?.join?.(',') : props?.data} 
							sx={{ width: props.width ?? '100%', border: 'none' }}
						/>
					));
				}, 500);
			}
			else{
				setContent(() => (
					<CustomizedTextField 
						disabled={ props.disabled ?? true } 
						label={props.label} 
						variant="filled" 
						value={props?.data}
						// defaultValue={typeof props?.data === Array ? props?.data?.join?.(',') : props?.data} 
						sx={{ width: props.width ?? '100%', border: 'none' }}
					/>
				));
			}

		}
		else if( state === 'loading' ){
			setContent(() => <Skeleton width={ props.width ?? '100%' } height="100px" /> );
		}
		else{
			setContent(() => (
				<CustomizedTextField 
					disabled={ props.disabled ?? true } 
					label={props.label} 
					variant="filled" 
					// defaultValue="N/A" 
					sx={{ width: props.width ?? '100%', border: 'none' }}
				/>
			));
		}

		return () => refresh ? clearInterval( refresh ) : null
	}, [state, props]);

	return (
		<>
			{ content }
		</>
	)
};

const SkeletonizedImage = props => {
	return(
		<>
			{
				props?.images
					? <ImageList sx={{ width: '100%', height: '100%' }} cols={3} rowHeight={164}>
          	{
              props?.images?.map( image => (
                  <ImageListItem key={uniqid()}>
                      <img
                      	className="image-list-item-img"
                        src={image}
                        // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt=""
                        loading="lazy"
                      />
                  </ImageListItem>
                ))
            }
					 </ImageList> 
					: <Skeleton width={ props.width } height={ props.height } />
			}
		</>
	)
};

// <img 
// 	src={props.data} 
// 	style={{ 
// 		width: props.width ?? '100%', 
// 		height: props.height ?? '100%',
// 		imageRendering: 'pixelated' 
// 	}}
// />

export default Dashboard;