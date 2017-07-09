A datepicker with React.

V0.1.1

Usage:
```javascript
import DatePicker from './DatePicker';

function fn(date){
	// fired when DatePicker changes date
	// parameter date: string, 'YYYY-MM-DD'
	//
}


ReactDOM.render(
		<DatePicker earliset-day={earliest_day} latest-day ={latest_day} callback={fn}/>,
		document.getElementById('root')
);

// earliest_day and latest_day are a string formatted as 'YYYY-MM-DD', default today and Infinity.

```

用gh-pages deploy老失败，原来没有装git，蛋疼。
