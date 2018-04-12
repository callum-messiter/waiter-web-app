/**
	Config settings for VMoney; any component which uses the package should import the settings
	from here using:
	***************************
		computed: {
	    money() {
	      return config.money;
	    }
	  }

	***************************
**/
module.exports.money = {
	decimal: '.',
	thousands: ',',
	prefix: '£',
	suffix: '',
	precision: 2,
	masked: false
}
