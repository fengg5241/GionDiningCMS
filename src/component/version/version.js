import React from 'react'

class Version extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			version:"0.0.6"
		}
	}
	
	render(){
		return (
			<div>
				{this.state.version}


			</div>
		)
	}
}

export default Version