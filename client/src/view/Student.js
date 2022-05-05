import React from 'react';
import Appbar from '../components/Appbar';
import axios from 'axios';
import Cookies from 'js-cookie';

import TableSkeleton from '../components/TableSkeleton';

import LinearProgress from '@mui/material/LinearProgress';
import SchoolYearAndSemester from '../context/SchoolYearAndSemester.js';

const Dashboard = React.lazy(() => import('./pages/student/Dashboard'));
const ChangePassword = React.lazy(() => import('./pages/student/ChangePassword'));
const Handbook = React.lazy(() => import('./pages/Handbook'));


const Student = props => {
	const [selectedYearAndSem, setSelectedYearAndSem] = React.useState( '' );
	const [content, setContent] = React.useState({ name: 'Dashboard', cont: <Dashboard name={ props.tools.name } selectedYearAndSem={selectedYearAndSem}/> });

	React.useEffect(() => {
		if( !selectedYearAndSem.length ){
			const yearStarted = new Date().getFullYear().toString().slice( 0, 2 ) + props?.tools?.name?.slice?.( 0, 2 );

			setSelectedYearAndSem( Cookies.get('crrntslctd')?.length ? Cookies.get('crrntslctd') : `${yearStarted}-${Number(yearStarted) + 1} - 1st semester`);

			Cookies.set('slctd', Cookies.get('slctd')?.length ? Cookies.get('slctd') : 2 );
			Cookies.set('xpndd', Cookies.get('xpndd')?.length ? Cookies.get('xpndd') : JSON.stringify(['1']) );
		}
	}, [selectedYearAndSem]);

	return(
		<SchoolYearAndSemester.Provider value={selectedYearAndSem}>
			<div style={{ width: '100%', height: '100%'}}>
				<Appbar 
					tools={props.tools}
					title="Student"
					setSelectedYearAndSem={setSelectedYearAndSem}
					listItems={[
						{ title: 'Dashboard', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard name={ props.tools.name } selectedYearAndSem={selectedYearAndSem}/> }) },
						{ title: 'Change-Password', onClick: () => content.name === 'Change-Password' ? null : setContent({ name: 'Change-Password', cont: <ChangePassword name={ props.tools.name } selectedYearAndSem={selectedYearAndSem}/> }) },
						{ title: 'Handbook', onClick: () => content.name === 'Handbook' ? null : setContent({ name: 'Handbook', cont: <Handbook/> }) },
					]}
				>
					<React.Suspense 
						fallback={<LinearProgress color="success"/>}
					>
						{ content.cont }
					</React.Suspense>
				</Appbar>
			</div>
		</SchoolYearAndSemester.Provider>
	)
}


export default Student;
