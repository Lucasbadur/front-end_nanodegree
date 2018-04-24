function makeGrid( height, width )
{
	let table = document.getElementById('pixelCanvas');
	table.innerHTML = '';

    for ( let i = 0; i < height; i++ )
    {
        let row = table.insertRow( i );
        for ( let j = 0; j < width; j++ )
        {
            let cell = row.insertCell( j );
            cell.addEventListener( 'click', function()
            {
    			cell.style.backgroundColor = color.val();
            } );
        }
    }
}

let color = $("#colorPicker");

document.getElementById('sizePicker').onsubmit = function()
{
	event.preventDefault();
	const height = document.getElementById('inputHeight').value;
	const width = document.getElementById('inputWidth').value;
	makeGrid( height, width );
}

// Making a grid appear by default
makeGrid( 15, 15 );