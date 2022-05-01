class ClanStat {
	constructor(u){
		$.getScript( u )
		  .done(this.createTable.bind(this))
		  .fail(function( jqxhr, settings, exception ) {
			alert('Data load Error');
		});
	}
	
	createTable(){
		var datatable_columns = [];
		table_header.forEach(h=>datatable_columns.push({title:h}));
			$('#clanstat_table').DataTable( {
			data: table_data,
			columns: datatable_columns,
			order: [[ datatable_columns.length-1, "desc" ]],
			pageLength: 50,
			dom:'ft',
		} );
	}
}