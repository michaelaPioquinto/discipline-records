import React from 'react';
import Axios from 'axios';

import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const ChangePassword = props => {
	const [currentPass, setCurrentPass] = React.useState( '' );
	const [newPass, setNewPass] = React.useState( '' );
	const [repeatPass, setRepeatPass] = React.useState( '' );
	const [errMsg, setErrMsg] = React.useState( '' );

	const handleSetCurrentPass = e => setCurrentPass( e.target.value );
	const handleSetNewPass = e => setNewPass( e.target.value );
	const handleSetRepeatPass = e => setRepeatPass( e.target.value );

	const handleChangePass = async () => {
		Axios.put(`${window.API_BASE_ADDRESS}`)
		.then( res => {

		})
		.catch( err => {
			throw err;
		});
	}

	return(
		<div className="w-100 h-100 d-flex justify-content-center align-items-center">
			<div className="col-md-6 h-50">
				<h5>Change your password</h5>
				<Divider variant="middle"/>
				<br/>
				<br/>
				<div className="col-12 px-3 d-flex flex-column justify-content-around align-items-center">
					<TextField fullWidth label="Current Password" value={currentPass} onChange={handleSetCurrentPass}/>
					<br/>
					<TextField fullWidth label="New Password" value={newPass} onChange={handleSetNewPass}/>
					<br/>
					<TextField fullWidth label="Repeat Password" value={repeatPass} onChange={handleSetRepeatPass}/>
					<br/>
					<Button onClick={handleChangePass}>
						Change Password
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ChangePassword;