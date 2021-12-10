import React from 'react';
import Appbar from '../components/Appbar';

import LinearProgress from '@mui/material/LinearProgress';

const Dashboard = React.lazy(() => import('./pages/system-admin/Dashboard'));
const Handbook = React.lazy(() => import('./pages/system-admin/Handbook'));
const Statistical = React.lazy(() => import('./pages/system-admin/Statistical'));
const Violation = React.lazy(() => import('./pages/system-admin/Violation'));
const Accounts = React.lazy(() => import('./pages/system-admin/Accounts'));
const Trash = React.lazy(() => import('./pages/Trash'));

const SystemAdmin = props => {
	const [content, setContent] = React.useState({ name: 'Dashboard', cont: <Dashboard/> });

	return(
		<div style={{ width: '100%', height: '100%'}}>
			<Appbar 
				tools={props.tools}
				title="System-Administrator" 
				listItems={[
					{ title: 'Dashboard', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard/> }) },
					{ title: 'Violation', onClick: () =>  content.name === 'Validation' ? null : setContent({ name: 'Violation', cont: <Violation/> })},
					{ title: 'Account', onClick: () => content.name === 'Account' ? null : setContent({ name: 'Account', cont: <Accounts/> }) },
					{ title: 'Statistical', onClick: () => content.name === 'Statistical' ? null : setContent({ name: 'Statistical', cont: <Statistical/> }) },
					{ title: 'Handbook', onClick: () => content.name === 'Handbook' ? null : setContent({ name: 'Handbook', cont: <Handbook/> }) },
					{ title: 'Trash', onClick: () => content.name === 'Trash' ? null : setContent({ name: 'Trash', cont: <Trash role="sysadmin"/> }) },
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

export default SystemAdmin;