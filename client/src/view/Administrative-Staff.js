import React from 'react';
import Appbar from '../components/Appbar';
import axios from 'axios';
import debounce from 'lodash.debounce';
import SearchContext from '../context/SearchContext';
import TableSkeleton from '../components/TableSkeleton';

import LinearProgress from '@mui/material/LinearProgress';

const Statistical = React.lazy(() => import('./pages/Statistical'));
// const MakeReport = React.lazy(() => import('./pages/admin-staff/MakeReport'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Violation = React.lazy(() => import('./pages/Violation'));
const Handbook = React.lazy(() => import('./pages/Handbook'));
const Accounts = React.lazy(() => import('./pages/admin-staff/Accounts'));
const Reports = React.lazy(() => import('./pages/admin-staff/Reports'));
const Archived = React.lazy(() => import('./pages/admin-staff/Archived'));

const AdminStaff = props => {
	const [searchContent, setSearchContent] = React.useState('');
	const [content, setContent] = React.useState({ name: 'Dashboard', cont: <Dashboard role="adminstaff" search={searchContent} getSearchContent={e => handleSearch( e )}/> });

	const handleSearch = e => {
		debounce(() => setSearchContent( e.target.value ), 100)();
	}

	return(
		<div style={{ width: '100%', height: '100%'}}>
			<Appbar 
				tools={props.tools}
				title="Administrative Staff"
				openSearchOn={['Dashboard', 'Violation', 'Account', 'Reports', 'Deactivated Students']}
				getSearchContent={e => handleSearch( e )}
				listItems={[
					{ title: 'Dashboard', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard role="adminstaff" search={searchContent} getSearchContent={e => handleSearch( e )}/> }) },
					{ title: 'Violation', onClick: () =>  content.name === 'Validation' ? null : setContent({ name: 'Violation', cont: <Violation role="adminstaff" search={searchContent} getSearchContent={e => handleSearch( e )}/> })},
					{ title: 'Account', onClick: () => content.name === 'Account' ? null : setContent({ name: 'Account', cont: <Accounts search={searchContent} getSearchContent={e => handleSearch( e )}/> }) },
					{ title: 'Deactivated Students', onClick: () => content.name === 'Deactivated Students' ? null : setContent({ name: 'Deactivated Students', cont: <Archived search={searchContent} getSearchContent={e => handleSearch( e )}/> }) },
					// { title: 'Make Report / Referral', onClick: () => content.name === 'Make Report' ? null : setContent({ name: 'Make Report / Referral', cont: <MakeReport /> }) },
					{ title: 'Reports', onClick: () => content.name === 'Reports' ? null : setContent({ name: 'Reports', cont: <Reports search={searchContent} getSearchContent={e => handleSearch( e )}/> }) },
					{ title: 'Statistical', onClick: () => content.name === 'Statistical' ? null : setContent({ name: 'Statistical', cont: <Statistical/> }) },
					{ title: 'Handbook', onClick: () => content.name === 'Handbook' ? null : setContent({ name: 'Handbook', cont: <Handbook/> }) },
				]}
			>
				<SearchContext.Provider value={searchContent}>
					<React.Suspense 
						fallback={<LinearProgress color="success"/>}
					>
						{ content.cont }
					</React.Suspense>
				</SearchContext.Provider>
			</Appbar>
		</div>
	)
}



export default AdminStaff;
