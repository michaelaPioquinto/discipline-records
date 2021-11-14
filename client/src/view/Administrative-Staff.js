import React from 'react';
import Appbar from '../components/Appbar';
import Dashboard from './pages/admin/Dashboard';
import axios from 'axios';


const AdminStaff = (props) => {
	
	// React.useEffect(() => {
	// 	const fetchStudentData = async() => {
	//      axios.get('http://localhost:3000/student-data')
	//      .then( res => {
	//        setRow( res.data );
	//      })
	//      .catch( err => {
	//        console.log( err );
	//      });
	//    }

	//    fetchStudentData();
	// }, []);

	return(
		<div style={{ width: '100%', height: '100%'}}>
			<Appbar 
				title="Administrative Staff" 
				listItems={[
					{ title: 'Dashboard', onClick: () => console.log('Dashboard') },
					{ title: 'Statistical', onClick: () => console.log('Statistical') },
					{ title: 'Handbook', onClick: () => console.log('Handbook') },
					{ title: 'Make Report', onClick: () => console.log('Make Report') },
				]}
			/>
			<Dashboard/>
		</div>	
	);
}




export default AdminStaff;
