import React from 'react';
import Appbar from '../components/Appbar';
import axios from 'axios';
import Cookies from 'js-cookie';

import TableSkeleton from '../components/TableSkeleton';

import LinearProgress from '@mui/material/LinearProgress';
import SchoolYearAndSemester from '../context/SchoolYearAndSemester.js';

const Dashboard = React.lazy(() => import('./pages/student/Dashboard'));
const Handbook = React.lazy(() => import('./pages/Handbook'));


const Student = props => {
	const [selectedYearAndSem, setSelectedYearAndSem] = React.useState( Cookies.get('crrntslctd') );
	const [content, setContent] = React.useState({ name: 'Dashboard', cont: <Dashboard name={ props.tools.name } selectedYearAndSem={selectedYearAndSem}/> });

	// React.useEffect(() => {
	// 	console.log( selectedYearAndSem );
	// }, [selectedYearAndSem]);

	return(
		<SchoolYearAndSemester.Provider value={selectedYearAndSem}>
			<div style={{ width: '100%', height: '100%'}}>
				<Appbar 
					tools={props.tools}
					title="Student"
					setSelectedYearAndSem={setSelectedYearAndSem}
					listItems={[
						{ title: 'Dashboard', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard name={ props.tools.name } selectedYearAndSem={selectedYearAndSem}/> }) },
						{ title: 'Handbook', onClick: () => content.name === 'Handbook' ? null : setContent({ name: 'Handbook', cont: <Handbook/> }) },
					]}
				/>
				<React.Suspense 
					fallback={<LinearProgress color="success"/>}
				>
					{ content.cont }
				</React.Suspense>
			</div>
		</SchoolYearAndSemester.Provider>
	)
}


export default Student;
