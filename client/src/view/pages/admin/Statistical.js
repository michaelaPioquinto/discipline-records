import React from 'react';
import axios from 'axios';

import Paper from '@mui/material/Paper';
import { Line } from 'react-chartjs-2'; 

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
			const currentLabels = [];

			for( let i = 0; i < data.years.length - 1 ; i++ ){
				const label = `${data.years[ i ]}-${data.years[ i + 1 ]}`;

				currentLabels.push( label );
			}

			setLabels([ ...currentLabels ]);

			setDatasets([
				{
					label: '1st Semester',
					data: data.firstSem,
					backgroundColor: '#636e72',
					borderColor: '#d63031'
				},
				{
					label: '2nd Semester',
					data: data.secondSem,
					backgroundColor: '#636e72',
					borderColor: '#0984e3'
				}
			]);
		}
	}, [data]);

	return(
		<div style={{ width: '100%', height: '100%' }} className="row p-0 m-0 d-flex justify-content-center align-items-start">
			<div style={{ height: 'fit-content' }} className="p-0 m-0 col-12 d-flex justify-content-center align-items-center">
				{
					data && datasets && labels && 
					(
						<Paper elevation={10} sx={{ width: '80vw', height: '90%', padding: '10px' }}>
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