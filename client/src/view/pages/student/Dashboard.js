import React from 'react';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';

// violation
// Duty
// Semester
// Course
// Evidence

const Dashboard = props => {
	const [studentData, setStudentData] = React.useState( null );

	const fetchStudentData = async () => {
		axios.get(`http://localhost:3000/student/${ props.id }`)
		.then( res => setStudentData( res.data ))
		.catch( err => {
			throw err;
		});
	}

	// React.useEffect(() => fetchStudentData(), []);

	return(
		<div style={{ width: '100%', height: '100%' }} className="row">
			<div className="col-md-3">
				<SkeletonizedTextfield />
			</div>
		</div>
	);
}


const SkeletonizedTextfield = props => (
	<>
		{
			props?.data
				? <TextField defaultValue={props.data} sx={{ width: props.width ?? '10cm' }}/>
				: <Skeleton width={ props.width } height="100px" />
		}
	</>
);

const SkeletonizedImage = props => (
	<>
		{
			props?.data
				? <img src={props.data} style={{ width: props.width ?? '10cm', height: props.height ?? '10cm' }}/>
				: <Skeleton width={ props.width } height={ props.height } />
		}
	</>
);

export default Dashboard;