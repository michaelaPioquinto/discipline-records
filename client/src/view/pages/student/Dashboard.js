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

import SummarizeIcon from '@mui/icons-material/Summarize';
import ContactMailIcon from '@mui/icons-material/ContactMail';

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
});

const Dashboard = props => {
	const [studentData, setStudentData] = React.useState( null );
	const [reportsView, setReportsView] = React.useState( [] );
	const [reportPage, setReportPage] = React.useState( 1 );

	const handleSwitchPage = ( _, value ) => {
		setReportPage( value );
	}

	const fetchStudentData = async () => {
		axios.get(`http://localhost:3000/student-report/${ props.name }`)
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

			studentData.report.forEach( rep => {
				reps.push( <Report key={ uniqid() } {...rep}/> );
			});

			setReportsView([ ...reps ]);
		}
	}, [studentData]);

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
			<div className="col-12 pl-2">
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
				<div className="col-md-12 my-2 d-flex justify-content-center align-items-center">
					<SkeletonizedTextfield width="100%" label="Student Name" data={studentData ? renderFullName() : null} />
				</div>
				{/*<div className="col-md-3 my-2 d-flex justify-content-center align-items-center">
					<SkeletonizedTextfield label="Middle Name" data={studentData?.student?.middleName}/>
				</div>
				<div className="col-md-3 my-2 d-flex justify-content-center align-items-center">
					<SkeletonizedTextfield label="Last Name" data={studentData?.student?.lastname}/>
				</div>*/}
			</div>

			<div className="row col-12 d-flex flex-row justify-content-between">
				<div className="col-md-3 my-2 d-flex justify-content-center align-items-center">
					<SkeletonizedTextfield label="Student ID" data={studentData?.student?.studentID} />
				</div>
				<div className="col-md-3 my-2 d-flex justify-content-center align-items-center">
					<SkeletonizedTextfield label="Course" data={ studentData?.student?.course } />
				</div>
				<div className="col-md-3 my-2 d-flex justify-content-center align-items-center">
					<SkeletonizedTextfield label="Year & Section" data={ studentData?.student?.yearSection } />
				</div>
				
				<div className="col-md-3 my-2 d-flex justify-content-center align-items-center">
					<SkeletonizedTextfield 
						label="Duty / Duties" 
						data={ studentData ? getDuties( studentData?.report ) : null }
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
				<div style={{ position: 'relative', width: '60%', minWidth: '350px' }} className="py-5 m-0">
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
				<SkeletonizedImage data={ props.images?.[ 0 ] } width="500px" height="500px"/>
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
	const [content, setContent] = React.useState( <Skeleton width={ props.width ?? '7cm' } height="100px" /> );

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
		if( state === 'ok' ){
			setContent(
				<CustomizedTextField 
					disabled={ props.disabled ?? true } 
					label={props.label} 
					variant="filled" 
					defaultValue={props?.data} 
					sx={{ width: props.width ?? '7cm', border: 'none' }}
				/>
			);	
		}
		else if( state === 'loading' ){
			setContent( <Skeleton width={ props.width ?? '7cm' } height="100px" /> );
		}
		else{
			setContent(
				<CustomizedTextField 
					disabled={ props.disabled ?? true } 
					label={props.label} 
					variant="filled" 
					defaultValue="N/A" 
					sx={{ width: props.width ?? '7cm', border: 'none' }}
				/>
			);
		}
	}, [state]);

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
				props?.data
					? <img 
						src={props.data} 
						style={{ 
							width: props.width ?? '100%', 
							height: props.height ?? '100%',
							imageRendering: 'pixelated' 
						}}
					/>
					: <Skeleton width={ props.width } height={ props.height } />
			}
		</>
	)
};


export default Dashboard;