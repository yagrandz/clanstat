class ClanStat {
	constructor(u){
		$.getScript( u )
		  .done(this.createTable.bind(this))
		  .fail(function( jqxhr, settings, exception ) {
			alert('Data load Error');
		});
	}
	
	createTable(){
		$('#clanstat_table').DataTable( {
			responsive: true,
			data: table_data,
			columns: table_header,
			order: [[ table_header.length-1, "desc" ]],
			pageLength: 50,
			dom:'ft',
		} );
	}
}