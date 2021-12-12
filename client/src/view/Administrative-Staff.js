import React from 'react';
import Appbar from '../components/Appbar';
import axios from 'axios';
import debounce from 'lodash.debounce';
import SearchContext from '../context/SearchContext';
import TableSkeleton from '../components/TableSkeleton';

import LinearProgress from '@mui/material/LinearProgress';

const Statistical = React.lazy(() => import('./pages/admin-staff/Statistical'));
const MakeReport = React.lazy(() => import('./pages/admin-staff/MakeReport'));
const Dashboard = React.lazy(() => import('./pages/admin-staff/Dashboard'));
const Violation = React.lazy(() => import('./pages/admin-staff/Violation'));
const Handbook = React.lazy(() => import('./pages/admin-staff/Handbook'));
const Accounts = React.lazy(() => import('./pages/admin-staff/Accounts'));
const Archived = React.lazy(() => import('./pages/admin-staff/Archived'));


const AdminStaff = props => {
	const [content, setContent] = React.useState({ name: 'Dashboard', cont: <Dashboard/> });
	const [searchContent, setSearchContent] = React.useState('');

	const handleSearch = e => {
		debounce(() => setSearchContent( e.target.value ), 100)();
	}

	return(
		<div style={{ width: '100%', height: '100%'}}>
			<Appbar 
				tools={props.tools}
				title="Administrator Staff"
				openSearchOn={['Dashboard', 'Violation', 'Account', 'Archived']}
				getSearchContent={e => handleSearch( e )}
				listItems={[
					{ title: 'Dashboard', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard search={searchContent}/> }) },
					{ title: 'Violation', onClick: () =>  content.name === 'Validation' ? null : setContent({ name: 'Violation', cont: <Violation search={searchContent}/> })},
					{ title: 'Account', onClick: () => content.name === 'Account' ? null : setContent({ name: 'Account', cont: <Accounts search={searchContent}/> }) },
					{ title: 'Make Report / Referral', onClick: () => content.name === 'Make Report' ? null : setContent({ name: 'Make Report / Referral', cont: <MakeReport /> }) },
					{ title: 'Archived', onClick: () => content.name === 'Archived' ? null : setContent({ name: 'Archived', cont: <Archived search={searchContent}/> }) },
					{ title: 'Statistical', onClick: () => content.name === 'Statistical' ? null : setContent({ name: 'Statistical', cont: <Statistical/> }) },
					{ title: 'Handbook', onClick: () => content.name === 'Handbook' ? null : setContent({ name: 'Handbook', cont: <Handbook/> }) },
				]}
			/>
			<SearchContext.Provider value={searchContent}>
				<React.Suspense 
					fallback={<LinearProgress color="success"/>}
				>
					{ content.cont }
				</React.Suspense>
			</SearchContext.Provider>
		</div>
	)
}



export default AdminStaff;
