import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import DatePicker from './DatePicker';



function callback(date){
	ReactDOM.render(
		<p>{`选择了日期：${date}`}</p>,
		document.getElementById('side')
	)
}


ReactDOM.render(
	<DatePicker earliest-day='2017-6-6' latest-day='2017-9-9' callback={callback}/>,
	document.getElementById('root')
);











registerServiceWorker();
