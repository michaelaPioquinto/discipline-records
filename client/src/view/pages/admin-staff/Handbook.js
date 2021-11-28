import React from 'react';



const Handbook = props => {
	return(
		<div style={{ width: '100%', height: '100%' }}>
			<object type="application/pdf" width='100%' height='100%' data="/docs/handbook.pdf"></object>
		</div>
	);
}


export default Handbook;