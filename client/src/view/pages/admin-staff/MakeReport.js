import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const MakeReport = props => {
	return(
		<div style={{ width: '100%', height: '90%', overflowY: 'auto' }} className="d-flex flex-column align-items-center">
			<div className="col-12 d-flex flex-column justify-content-start align-items-start p-5">
				<h4 className="text-uppercase">city college of tagaytay</h4>
				<h1 className="text-uppercase">student incident report</h1>
			</div>
			<div className="container-fluid">
				<Divider/>
			</div>
			<div className="row container-fluid d-flex justify-content-around align-items-center">
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} label="Reported By" variant="standard"/>
						<TextField sx={{ width: '300px' }} label="Title/Role" variant="standard"/>
					</Stack>
				</div>
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} helperText="Date of Report" type="date" variant="standard"/>
						<TextField sx={{ width: '300px' }} label="Incident no." type="number" variant="standard"/>
					</Stack>
				</div>
			</div>
			
			<div style={{ color: 'white' }} className="col-11 bg-dark py-1 d-flex justify-content-center align-items-center rounded">
				<h5 className="text-uppercase p-0 m-0">
					student incident information
				</h5>
			</div>

			<div className="row container-fluid d-flex justify-content-around align-items-center">
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} label="Student Name" variant="standard"/>
						<TextField sx={{ width: '300px' }} helperText="Date of Incident" type="date" variant="standard"/>
					</Stack>
				</div>
				<div className="col-md-6 d-flex	justify-content-center align-items-center my-5">
					<Stack spacing={2}>
						<TextField sx={{ width: '300px' }} label="Course / Yr / Section" variant="standard"/>
						<TextField sx={{ width: '300px' }} label="Time of Incident" variant="standard"/>
					</Stack>
				</div>
			</div>

			<div className="row d-flex flex-column justify-content-center align-items-center mb-5">
				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} label="Location" variant="standard"/>
				</div>

				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} label="Specific Area of Location" variant="standard"/>
				</div>

				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} label="Additional Person(s) Involved" variant="standard"/>
				</div>

				<div className="col-md-12 d-flex justify-content-center align-items-center">
					<TextField sx={{ width: '80vw', margin: '10px' }} label="Witnesses" variant="standard"/>
				</div>
			</div>

			<div className="d-flex flex-column justify-content-between align-items-center">
				<TextField
					sx={{ width: '80vw', margin: '50px' }}
					id="standard-multiline-flexible"
					label="Incident Description"
					multiline
					rows={10}
					maxRows={4}
					// value={value}
					// onChange={handleChange}
					variant="filled"
        />

				


        <TextField
					sx={{ width: '80vw', margin: '50px' }}
					id="standard-multiline-flexible"
					label="Description of Unacceptable / Unsafe Behavior or Conditions (If applicable)"
					multiline
					rows={10}
					maxRows={4}
					// value={value}
					// onChange={handleChange}
					variant="filled"
        />

        <TextField
					sx={{ width: '80vw', margin: '50px' }}
					id="standard-multiline-flexible"
					label="Resulting Action Executed or Planned"
					multiline
					rows={10}
					maxRows={4}
					// value={value}
					// onChange={handleChange}
					variant="filled"
        />
			</div>

			<div className="row container-fluid d-flex flex-column justify-content-center align-items-center">
				<div className="row col-12 d-flex flex-row justify-content-around align-items-center m-3">
					<div className="col-md-4 d-flex	justify-content-center	align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} label="Faculty / Employee Name" variant="standard"/>
					</div>

					<div className="col-md-4 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} helperText="Date" type="date" variant="standard"/>
					</div>
				</div>

				<div className="row col-12 d-flex flex-row justify-content-around align-items-center m-3">
					<div className="col-md-5 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} label="Head / Chairperson Name" variant="standard"/>
					</div>

					<div className="col-md-5 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} helperText="Date" type="date" variant="standard"/>
					</div>
				</div>
{/*
				<Root>
					<Divider textAlign="left">
						<Chip label="OPTIONAL"/>
					</Divider>
				</Root>
				<div className="row col-12 d-flex flex-row justify-content-around align-items-center m-3">
					<div className="col-md-4 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} label="Student Name" variant="standard"/>
					</div>

					<div className="col-md-4 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} label="Student Signature" variant="standard"/>
					</div>

					<div className="col-md-4 d-flex justify-content-center align-items-center">
						<TextField sx={{ width: '7cm', margin: '5px' }} helperText="Date" type="date" variant="standard"/>
					</div>
				</div>
				<Root>
					<Divider/>
				</Root>
*/}			</div>
			<div className="d-flex justify-content-around align-items-center my-5">
				<Button variant="outlined" color="success" sx={{ width: '150px' }}>
				  Submit
				</Button>
			</div>
		</div>
	);
}

export default MakeReport;