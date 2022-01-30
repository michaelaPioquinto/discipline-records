import React from 'react';
import axios from 'axios';

import Paper from '@mui/material/Paper';
import { Line } from 'react-chartjs-2'; 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend	
);

const options = {
	responsive: true,
	plugins: {
		legend:{
			position: 'top'
		},
		title: {
			display: true,
			text: 'Accumulated Number of Violators'
		}
	}
}

const Statistical = props => {
	const [data, setData] = React.useState( null );
	const [labels, setLabels] = React.useState( null );
	const [datasets, setDatasets] = React.useState( null );
	const [statisticalHistory, setStatisticalHistory] = React.useState( [] );

	const fetchData = async () => {
		axios.get('http://localhost:3000/statistical-data')
		.then( res => {
			setData( res.data );
		})
		.catch( err => {
			throw err;
		});
	}

	React.useEffect(() => fetchData(), []);

	React.useEffect(() => {
		if( data ){
			const tempData = [ ...data ];
			const tempStatsHistory = [];
			const currentLabels = [];
			const semester1List = [];
			const semester2List = [];

			tempData.reverse();
			for( let i = 0; i < 10 ; i++ ){
				if( tempData.length > i ){
					currentLabels.push( tempData[ i ].year );
				}
				else{
					break;
				}
			}

			setLabels([ ...currentLabels.reverse() ]);

			tempData.forEach(({ semester1, semester2 }, index) => {
				if( index > 10 ) return;

				semester1List.push( semester1 );
				semester2List.push( semester2 );
			});

			setDatasets([
				{
					label: '1st Semester',
					data: semester1List,
					backgroundColor: '#636e72',
					borderColor: '#d63031'
				},
				{
					label: '2nd Semester',
					data: semester2List,
					backgroundColor: '#636e72',
					borderColor: '#0984e3'
				}
			]);

			data.forEach( datum => {
				tempStatsHistory.push(
					<TableRow>
						<TableCell align="left"> { datum.year } </TableCell>
						<TableCell align="right"> { datum.semester1 } </TableCell>
						<TableCell align="right"> { datum.semester2 } </TableCell>
						<TableCell align="right"> { datum.semester1 + datum.semester2 }</TableCell>
					</TableRow>
				);
			});

			setStatisticalHistory([ ...tempStatsHistory ]);
		}
	}, [data]);

	return(
		<div style={{ width: '100%', height: '100%' }} className="p-0 m-0 d-flex flex-row justify-content-center align-items-start">
			<div className="p-0 m-0 col-md-5 d-flex justify-content-center align-items-center">
				<TableContainer component={Paper}>
			      <Table aria-label="simple table">
			        <TableHead>
			          <TableRow>
			            <TableCell>Year</TableCell>
			            <TableCell align="right">1st Sem</TableCell>
			            <TableCell align="right">2nd Sem</TableCell>
			            <TableCell align="right">Total</TableCell>
			          </TableRow>
			        </TableHead>
			        <TableBody>
			          { statisticalHistory }
			        </TableBody>
			      </Table>
			    </TableContainer>
			</div>
			<div style={{ height: '100%' }} className="p-0 m-0 col-md-7 d-flex justify-content-center align-items-center">
				{
					data && datasets && labels && 
					(
						<Paper elevation={10} sx={{ width: '80vw', height: '100%', padding: '10px' }}>
							<Line
								options={options}
								data={{
									labels: labels,
									datasets: datasets
								}}
							/>
						</Paper>
					)
				}
			</div>
		</div>
	);
}

export default Statistical;