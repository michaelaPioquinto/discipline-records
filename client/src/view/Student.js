import React from 'react';
import Appbar from '../components/Appbar';
import axios from 'axios';

import TableSkeleton from '../components/TableSkeleton';

import LinearProgress from '@mui/material/LinearProgress';

const Dashboard = React.lazy(() => import('./pages/student/Dashboard'));
const Handbook = React.lazy(() => import('./pages/Handbook'));

const Student = props => {
	const [content, setContent] = React.useState({ name: 'Dashboard', cont: <Dashboard name={ props.tools.name }/> });

	React.useEffect(() => {
		console.log( props.tools.name );
	}, []);

	return(
		<div style={{ width: '100%', height: '100%'}}>
			<Appbar 
				tools={props.tools}
				title="Student" 
				listItems={[
					{ title: 'Dashboard', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard name={ props.tools.name }/> }) },
					{ title: 'Handbook', onClick: () => content.name === 'Handbook' ? null : setContent({ name: 'Handbook', cont: <Handbook/> }) },
				]}
			/>
			<React.Suspense 
				fallback={<LinearProgress color="success"/>}
			>
				{ content.cont }
			</React.Suspense>
		</div>
	)
}


export default Student;
