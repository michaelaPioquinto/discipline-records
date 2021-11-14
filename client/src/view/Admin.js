import Appbar from '../components/Appbar';
import Dashboard from './pages/admin/Dashboard';

const Admin = props => {
	return(
		<div style={{ width: '100%', height: '100%'}}>
			<Appbar 
				title="Administrator" 
				listItems={[
					{ title: 'Dashboard', onClick: () => console.log('Dashboard') },
					{ title: 'Validation', onClick: () => console.log('Validation') },
					{ title: 'Statistical', onClick: () => console.log('Statistical') },
					{ title: 'Account', onClick: () => console.log('Account') },
					{ title: 'Handbook', onClick: () => console.log('Handbook') },
				]}
			/>

			<Dashboard/>
		</div>
	)
}

export default Admin;
