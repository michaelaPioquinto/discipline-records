import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import uniqid from 'uniqid';

import TableV2 from '../../../components/Table-v2';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Backdrop from '@mui/material/Backdrop';
import Carousel from 'react-bootstrap/Carousel'

const DutyEvidenceReport = props => {
	const [items, setItems] = React.useState( [] );
	const [dutyReports, setDutyReports] = React.useState( [] );
	const [selected, setSelected] = React.useState( null );
	const [selectedData, setSelectedData] = React.useState( [] );

	const [seenReports, setSeenReports] = React.useState( JSON.parse(Cookies.get('seenReports') ?? null) ?? {} );
	const updateSeenReports = React.useCallback(( studentID, id ) => {
		if(!seenReports[ studentID ]){
			const seenRep = {};
			seenRep[`${studentID}`] = [ id ];

			setSeenReports({ ...seenReports, ...seenRep });
		}
		else{
			const tempSeenRep = { ...seenReports };

			if(tempSeenRep[ studentID ].includes( id )) return;
			tempSeenRep[ studentID ].push( id );

			setSeenReports({ ...tempSeenRep });
		}
	}, [seenReports]);

	// const seenReports = React.useMemo(() => {
	// 	const sr = Cookies.get('seenReports');

	// 	if( !sr ) return {};
	// 	let seenReps = JSON.parse( sr ); 

	// 	dutyReports?.forEach( dr => {
	// 		if(!seenReps[ dr.studentID ]){
	// 			const seenRep = {};
	// 			seenRep[`${dr.studentID}`] = [ dr._id ];

	// 			seenReps = { ...seenReps, ...seenRep };
	// 		}
	// 		else{
	// 			const tempSeenRep = { ...seenReps };

	// 			if(tempSeenRep[ dr.studentID ].includes( dr._id )) return;
	// 			tempSeenRep[ dr.studentID ].push( dr._id );

	// 			seenReps = { ...tempSeenRep };
	// 		}
	// 	});

	// 	return seenReps;
	// }, [dutyReports]);

	const fetchStudentData = async() => {
	    axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/student-data`)
	    .then( res => {
	        setItems( res.data );
	    })
	    .catch( err => {
	      throw err;
	    });
	}

	const fetchDutyReport = async( dr ) => {
	    axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/get-duty-report`)
	    .then( res => {
	    	if(JSON.stringify( dr ) === JSON.stringify( res.data )) return;
	        setDutyReports( res.data );
	    })
	    .catch( err => {
			throw err;
	    });
	}

	const getUnreadMessagesNumber = studentID => {
		let unreadMessagesNumber = 0;

		dutyReports.forEach( dr => {
			if( dr.studentID === studentID ){
				unreadMessagesNumber++;
			}
		});

		return seenReports?.[ studentID ]?.length 
			? unreadMessagesNumber === seenReports?.[ studentID ]?.length
				? 0
				: Math.abs(unreadMessagesNumber - seenReports?.[ studentID ]?.length)
			: unreadMessagesNumber;
	}

	React.useEffect(() => {
		fetchStudentData();
		fetchDutyReport( dutyReports );
	}, []);

	React.useEffect(() => {
		const poolling = setInterval(() => {
			fetchDutyReport( dutyReports );
		}, 3000);

		return () => clearInterval( poolling );
	}, [dutyReports]);

	// React.useEffect(() => {
	// 	if( dutyReports?.length ){
			
	// 	}
	// }, [dutyReports, seenReports]);

	React.useEffect(() => {
		if( seenReports ){
			Cookies.set('seenReports', JSON.stringify(seenReports));
		}

	}, [seenReports]);

	React.useEffect(() => {
		if( dutyReports.length && selected ){
			const temp = [];

			dutyReports.forEach( dr => {
				if( dr.studentID === selected ){
					temp.push( dr );
					updateSeenReports( selected, dr._id );
				}
			});

			setSelectedData([ ...temp ]);
		}
		else{
			setSelectedData( null );
		}
	}, [selected, dutyReports, updateSeenReports]);

	return(
		<div style={{ width: '100%', height: '100%' }}>
			<TableV2
				items={items} 
		        onClick={val => setSelected( val )} 
		        userType={props?.role} 
		        searchPlaceHolder="Student ID"
		        setSearch={e => props?.getSearchContent?.( e )}
		        generateRows={( index, style, props ) => {
		          const renderFullName = item => {
		              if( !item?.firstName && !item?.lastname )
		                return null;

		              const middleName = item?.middleName ?? '';

		              return (
			              item?.firstName + ' ' +
			              middleName + ' ' +
			              item?.lastname 
		              );
		          }

		          const renderCourseYrSection = item => {
		            if( !item?.course ) return null;

		            return item?.course;
		          }

		          return (
		            <div 
		              style={{ ...style }} 
		              onClick={() => props.onClick( props?.items?.[ index ]?.studentID )}
		              className="table-v2-row col-12 d-flex"
		            > 
						<div 
							style={{
							  borderRight: '1px solid rgba(0, 0, 0, 0.1)'
							}} 
							className={`col-4 d-flex align-items-center justify-content-center text-center"`}
						>
							<Badge badgeContent={getUnreadMessagesNumber( props?.items?.[ index ]?.studentID 	)} color="error">
								{ props?.items?.[ index ]?.studentID }
							</Badge>
						</div>
						<div className={`col-4 d-flex align-items-center justify-content-center text-center"`}>
							{ renderFullName( props?.items?.[ index ] ) }
						</div>
						<div 
							style={{
							  borderLeft: '1px solid rgba(0, 0, 0, 0.1)'
							}} 
							className={`col-4 d-flex align-items-center justify-content-center text-center"`}
						>
							{ props?.items?.[ index ]?.course }
						</div>
		            </div>
		          )
		        }}
		        generateHeader={props => (
		          <>
		            <div className={`${props?.userType === 'adminstaff' ? 'col-3' : 'col-4'} d-flex align-items-center justify-content-center text-center"`}>
		              <b>Student ID</b>
		            </div>
		            <div className={`${props?.userType === 'adminstaff' ? 'col-3' : 'col-4'} d-flex align-items-center justify-content-center text-center"`}>
		              <b>Full Name</b>
		            </div>
		            <div className={`${props?.userType === 'adminstaff' ? 'col-3' : 'col-4'} d-flex align-items-center justify-content-center text-center"`}>
		              <b>Course</b>
		            </div>
		          </>
		        )}	
			/>
			<Backdrop open={!!selected && !!selectedData?.length}>
				<div style={{ width: '100%', minWidth: '300px', maxWidth: '600px', height: 'fit-content' }} className="p-3 bg-white rounded">
					<CustomeCarousel reports={selectedData}/>
					<div className="d-flex justify-content-end align-items-center p-2">
						<Button onClick={() => setSelected( null )}>
							Close
						</Button>
					</div>
				</div>
			</Backdrop>
		</div>
	);
}

const CustomeCarousel = props => {
	return(
		<Carousel variant="dark">
			{
				props?.reports?.map( report => (
					<Carousel.Item interval={1000} key={uniqid()}>
						<p>Date submitted: <b>{ report?.date }</b></p>
					    <img
					    	style={{ width: '100%', minWidth: '300px', maxWidth: '600px', height: 'auto' }}
							className="d-block"
							src={report.filePath}
							alt=""
					    />
					</Carousel.Item>
				))
			}
		</Carousel>
	);
}


export default DutyEvidenceReport;