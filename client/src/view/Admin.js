import React from 'react';
import Appbar from '../components/Appbar';
import axios from 'axios';
import debounce from 'lodash.debounce';
import SearchContext from '../context/SearchContext';

import TableSkeleton from '../components/TableSkeleton';

import LinearProgress from '@mui/material/LinearProgress';

const Statistical = React.lazy(() => import('./pages/Statistical'));
const SchoolYears = React.lazy(() => import('./pages/admin/SchoolYears'));
const Violation = React.lazy(() => import('./pages/Violation'));
const Handbook = React.lazy(() => import('./pages/Handbook'));
const Accounts = React.lazy(() => import('./pages/admin/Accounts'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Trash = React.lazy(() => import('./pages/Trash'));

const Admin = props => {
	const [searchContent, setSearchContent] = React.useState('');
	const [content, setContent] = React.useState({ name: 'Dashboard', cont: <Dashboard search={searchContent} getSearchContent={e => handleSearch( e )} tools={props.tools}/> });

	const handleSearch = e => {
		debounce(() => setSearchContent( e.target.value ), 100)();
	}

	React.useEffect(() => {
		setSearchContent( '' );
	}, [content]);

	return(
		<div style={{ width: '100%', height: '100%'}}>
			<Appbar 
				tools={props.tools}
				title="Administrator" 
				openSearchOn={['Dashboard', 'Violation', 'Account', 'Trash']}
				getSearchContent={e => handleSearch( e )}
				listItems={[
					{ title: 'Dashboard', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard search={searchContent} getSearchContent={e => handleSearch( e )} tools={props.tools}/> }) },
					{ title: 'Violation', onClick: () =>  content.name === 'Validation' ? null : setContent({ name: 'Violation', cont: <Violation role="admin" search={searchContent} getSearchContent={e => handleSearch( e )}/> })},
					{ title: 'Account', onClick: () => content.name === 'Account' ? null : setContent({ name: 'Account', cont: <Accounts search={searchContent} getSearchContent={e => handleSearch( e )}/> }) },
					{ title: 'S.Y & Semester', onClick: () => content.name === 'S.Y & Semester' ? null : setContent({ name: 'S.Y & Semester', cont: <SchoolYears search={searchContent} getSearchContent={e => handleSearch( e )}/> }) },
					{ title: 'Statistical', onClick: () => content.name === 'Statistical' ? null : setContent({ name: 'Statistical', cont: <Statistical/> }) },
					{ title: 'Handbook', onClick: () => content.name === 'Handbook' ? null : setContent({ name: 'Handbook', cont: <Handbook/> }) },
					// { title: 'Trash', onClick: () => content.name === 'Trash' ? null : setContent({ name: 'Trash', cont: <Trash role="admin" search={searchContent} getSearchContent={e => handleSearch( e )}/> }) },
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


export default Admin;
