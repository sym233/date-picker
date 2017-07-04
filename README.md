A datepicker with React.

Usage:
```javascript
import DatePicker from './DatePicker';

function fn(date){
	// fired when DatePicker changes date
	// parameter date: string, 'YYYY-MM-DD'
	//
}


ReactDOM.render(
		<DatePicker callback={fn}/>,
		document.getElementById('root')
);


```