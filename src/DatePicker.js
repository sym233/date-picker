import React from 'react';
// import ReactDOM from 'react-dom';

import './DatePicker.css'

'use strict';

let LATEST_DAY;
let LATEST_TS;
let EARLIEST_DAY;
let EARLIEST_TS;
let date_selected;
// set after DatePicker called

const TODAY = new Date();
// TODAY
TODAY.setHours(0);
TODAY.setMinutes(0);
TODAY.setSeconds(0);
TODAY.setMilliseconds(0);

const MILLISEC_PER_DAY = 24*60*60*1000;

function to_prev_day(date){
	if(date instanceof Date){
		const ts = date.getTime() - MILLISEC_PER_DAY;
		return date.setTime(ts);
	}else{
		throw new Error('Unexpected type date');
	}
}
function to_next_day(date){
	if(date instanceof Date){
		const ts = date.getTime() + MILLISEC_PER_DAY;
		return date.setTime(ts);
	}else{
		throw new Error('Unexpected type date');
	}
}

function format_date(date){
	// timestamp(ms) to 'YYYY-MM-DD'
	let day;
	if(date instanceof Date){
		day = date;
	}else{
		day = new Date();
		day.setTime(date);
	}

	const y = day.getFullYear();
	const m = day.getMonth() + 1;
	const d = day.getDate();

	return `${y}-${m<10? '0'+m: m}-${d<10? '0'+d: d}`;
}

function selectable(ts){
	if(EARLIEST_TS <= ts && ts <= LATEST_TS){
		return true;
	}else{
		return false;
	}
}



function DisplayDate(ts, month){

	let classname = 'display-date';
	const date = new Date();
	date.setTime(ts);
	const formatted = format_date(date);

	if(date.getMonth() === month){
		classname += ' in-month';
	}else{
		classname += ' not-in-month';
	}
	if(selectable(ts)){
		classname += ' selectable';
	}else{
		classname += ' not-selectable';
	}
	if(formatted === format_date(TODAY)){
		classname += ' date-today';
	}
	if(formatted === date_selected){
		classname += ' date-selected';
	}

	return <div className={classname}
		id={`display-date-${formatted}`}>
		{date.getDate()}
	</div>;
}


class DateSelector extends React.Component{
	constructor(props){
		super(props);

		const d = this.get_first_sunday(this.props.inmonth);
		const month_calendar = this.preform_42_days_from(d);
		this.state = {
			'inmonth': props.inmonth,
			'cld' : month_calendar,
		};
		this.next_month = this.next_month.bind(this);
		this.prev_month = this.prev_month.bind(this);


	}

	get_first_sunday(date){
		const d = new Date(date);
		d.setDate(1);
		d.setHours(0);
		let count = 0;
		while(d.getDay() !== 0){
			to_prev_day(d);

			count++;
			if(count > 100){
				throw new Error('maybe dead loop');
			}
		}
		return d;
	}
	preform_42_days_from(date){
		const month_calendar = [];
		for(let week = 0; week < 6; week++){
			// 6 weeks in a month calendar
			month_calendar[week] = [];
			for(let day = 0; day < 7; day++){
				// 7 days in a week
				month_calendar[week][day] = date.getTime();
				to_next_day(date);
			}
		}
		return month_calendar;
	}
	next_month(){
		const month = this.state.inmonth.getMonth();

		const newdate = new Date(this.state.inmonth);
		newdate.setMonth(month + 1);

		const d = this.get_first_sunday(newdate);
		const month_calendar = this.preform_42_days_from(d);

		this.setState({
			'cld' : month_calendar,
			'inmonth': newdate,
		});
	}
	prev_month(){
		const month = this.state.inmonth.getMonth();

		const newdate = new Date(this.state.inmonth);
		newdate.setMonth(month - 1);

		const d = this.get_first_sunday(newdate);
		const month_calendar = this.preform_42_days_from(d);
		
		this.setState({
			'cld' : month_calendar,
			'inmonth': newdate,
		});
	}

	render(){
		const month = this.state.inmonth.getMonth();
		if(this.state && this.state.cld){

			return <div className='date-selector' onClick={this.props.click_cb}>
				<div className='selector-header'>
					<button onClick={this.prev_month}>{'<'}</button>
					<h5>{format_date(this.state.inmonth).slice(0, 7)}</h5>
					<button onClick={this.next_month}>{'>'}</button>
					<button className='close-btn'>X</button>
				</div>
				<table>
					<caption>选择日期
					</caption>
					<thead>
						<tr>
						</tr>
						<tr>
							<th>Sun</th>
							<th>Mon</th>
							<th>Tue</th>
							<th>Wed</th>
							<th>Thu</th>
							<th>Fri</th>
							<th>Sat</th>
						</tr>
					</thead>
					<tbody>
						{this.state.cld.map((week, i)=>
							<tr key={i}>
								{week.map((ts, j)=>
									<td key={j}>{
										DisplayDate(ts, month)
									}</td>
								)}
							</tr>
						)}
					</tbody>
				</table>
			</div>;
		}else{
			return <p>未加载</p>;
		}
	}
}

class DatePicker extends React.Component{
	constructor(props){
		super(props);
		if(props['earliest-day']){
			EARLIEST_DAY = new Date(props['earliest-day']);
			EARLIEST_TS = EARLIEST_DAY.getTime();
		}else{
			EARLIEST_DAY = TODAY;
			EARLIEST_TS = EARLIEST_DAY.getTime();
		}


		if(props['latest-day']){
			LATEST_DAY = new Date(props['latest-day']);
			LATEST_TS = LATEST_DAY.getTime();
		}else{
			LATEST_TS = Infinity;
		}


		if(selectable(TODAY.getTime())){
			date_selected = format_date(TODAY);
		}else{
			date_selected = format_date(EARLIEST_DAY);
		}

		this.state = {
			'selected-date': date_selected,
			'show-selector': false,
		};
		

		this.handleClick = this.handleClick.bind(this);
		this.showSelector = this.showSelector.bind(this);
	}

	handleClick(ev){
		// if(ev.target.className)
		const className = ev.target.className;
		const id = ev.target.id;
		if(className.includes('selectable') && !className.includes('not-selectable')){
			const m = id.match(/\d{4}-\d{2}-\d{2}/);
			if(m !== null){
				if(this.props.callback instanceof Function){
					this.props.callback.call(null, m[0]);
				}
				this.setState({
					'selected-date': m[0],
					'show-selector': false,
				});
				date_selected = m[0];

			}
		}
		if(className.includes('close-btn')){
			this.setState({
				'show-selector': false,
			});
		}
	}

	showSelector(){
		this.setState({
			'show-selector': true,
		});
	}

	render(){
		
		return <div className='data-picker'>
			<div className='select-result' onClick={this.showSelector}>
				<span>{this.state['selected-date']}</span>
			</div>
			{this.state['show-selector']? 
				<DateSelector inmonth={new Date(date_selected)} click_cb={this.handleClick}/>:
				null
			}
		</div>;
	}
}

export default DatePicker;
