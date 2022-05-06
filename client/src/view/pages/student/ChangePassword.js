import React from 'react';
import Axios from 'axios';

import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'notistack';

import InputAdornment from '../../../components/InputAdornment';

const ChangePassword = props => {
	const initlMsg = { text: '', type: '' };
	const { enqueueSnackbar } = useSnackbar();

	const [currPass, setcurrPass] = React.useState( '' );
	const [newPass, setNewPass] = React.useState( '' );
	const [repeatPass, setRepeatPass] = React.useState( '' );
	const [isSubmit, setIsSubmit] = React.useState( false );
	const [msg, setMsg] = React.useState( initlMsg );

	const isLengthOverEight = React.useMemo(() => newPass.length >= 8, [ newPass ]);
	const arePasswordsMatch = React.useMemo(() => newPass === repeatPass, [ newPass, repeatPass ]);

	const handleSetcurrPass = e => setcurrPass( e.target.value );
	const handleSetNewPass = e => setNewPass( e.target.value );
	const handleSetRepeatPass = e => setRepeatPass( e.target.value );

	const handleChangePass = async () => {
		const doesIdExist = !!props?.name;

		if( doesIdExist ){
			Axios.put(
				`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/change-student-password/id/${props?.name}`,
				{ newPass, currPass }
			)
			.then( res => {
				setcurrPass('');
				setNewPass('');
				setRepeatPass('');

				setMsg({ 
					text: res?.data?.message ?? 'Successfully changed password!',
					type: 'success' 
				});
			})
			.catch( err => {
				setMsg({ 
					text: err?.response?.data?.message ?? 'Please try again!',
					type: 'error' 
				});
			});
		}
	}

	React.useEffect(() => {
		const isMsgNotEmpty = !!msg.text;

		if( isMsgNotEmpty ){
			enqueueSnackbar( msg.text, { variant: msg.type });
		}
	}, [msg]);

	return(
		<div className="w-100 h-100 d-flex justify-content-center align-items-center">
			<div className="col-md-6 h-50">
				{/*{ !!msg?.text && <Alert severity={msg.type}>{ msg.text }</Alert> }*/}
				<h5>Change your password</h5>
				<Divider variant="middle"/>
				<br/>
				<br/>
				<div className="col-12 px-3 d-flex flex-column justify-content-around align-items-center">
					<InputAdornment 
						width="100%"
						label="Current Password" 
						value={currPass} 
						type="password"
						onChange={handleSetcurrPass}
						for="password"
						variant="filled"
					/>
					<br/>
					<InputAdornment 
						width="100%"
						label="New Password" 
						value={newPass} 
						type="password"
						onChange={handleSetNewPass}
						for="password"
						variant="filled"
						helperText="Length must be greater than 8"
					/>
					<br/>
					<InputAdornment 
						width="100%"
						label="Repeat Password" 
						value={repeatPass} 
						type="password"
						onChange={handleSetRepeatPass}
						for="password"
						variant="filled"
						error={repeatPass.length && !arePasswordsMatch}
						helperText={repeatPass.length && !arePasswordsMatch ? "Passwords did not match" : ''}
					/>
					<br/>
					<Button onClick={handleChangePass} disabled={!isLengthOverEight || !arePasswordsMatch}>
						Change Password
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ChangePassword;