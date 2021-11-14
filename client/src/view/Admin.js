import React from 'react';
import Appbar from '../components/Appbar';
import Dashboard from './pages/admin/Dashboard';

const Admin = props => {
	const [content, setContent] = React.useState({ name: 'Dashboard', cont: <Dashboard/> });

	return(
		<div style={{ width: '100%', height: '100%'}}>
			<Appbar 
				title="Administrator" 
				listItems={[
					{ title: 'Dashboard', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard/> }) },
					{ title: 'Validation', onClick: () =>  content.name === 'Validation' ? null : setContent({ name: 'Validation', cont: <Validation/> })},
					{ title: 'Statistical', onClick: () => content.name === 'Statistical' ? null : setContent({ name: 'Statistical', cont: <Statistical/> }) },
					{ title: 'Account', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard/> }) },
					{ title: 'Handbook', onClick: () => content.name === 'Dashboard' ? null : setContent({ name: 'Dashboard', cont: <Dashboard/> }) },
				]}
			/>
			{ content.cont }
		</div>
	)
}


const Validation = props => {
	return(
		<h1>
			Validation
		</h1>
	)
}


const Statistical = props => {
	return(
		<h1>
			Statistical
		</h1>	
	)
}

export default Admin;
