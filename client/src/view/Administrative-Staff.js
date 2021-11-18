import React from 'react';
import Appbar from '../components/Appbar';
import axios from 'axios';

import TableSkeleton from '../components/TableSkeleton';

import LinearProgress from '@mui/material/LinearProgress';

const Dashboard = React.lazy(() => import('./pages/admin-staff/Dashboard'));
const Violation = React.lazy(() => import('./pages/admin-staff/Violation'));
const Accounts = React.lazy(() => import('./pages/admin-staff/Accounts'));

const AdminStaff = props => {
	const [content, setContent] = React.useState({ name: 'Dashboard', cont: <Dashboard/> });

	return(
		<div style={{ width: '100%', height: '100%'}}>
			<Appbar 
				tools={props.tools}
				title="Administrator Staff" 
				listItems={[
					{ title: 'Dashboard', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard/> }) },
					{ title: 'Violation', onClick: () =>  content.name === 'Validation' ? null : setContent({ name: 'Violation', cont: <Violation/> })},
					{ title: 'Account', onClick: () => content.name === 'Account' ? null : setContent({ name: 'Account', cont: <Accounts/> }) },
					// { title: 'Statistical', onClick: () => content.name === 'Statistical' ? null : setContent({ name: 'Statistical', cont: <Statistical/> }) },
					// { title: 'Handbook', onClick: () => content.name === 'Handbook' ? null : setContent({ name: 'Handbook', cont: <Handbook/> }) },
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



export default AdminStaff;
