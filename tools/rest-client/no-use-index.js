
var IS_PARAMS = false;
var divParams = $('#idDivParams');
var divHeaders = $('#idDivHeaders');
var divAuthorizations = $('#idDivAuthorizations');

$().ready(function()
{
	$('.card-header').click(function()
	{
		$(this).next('.card-body').toggle('slow');
});

	/**
	$("#idTextRequestBody").bcralnit(
	{
		width: '50px',
		background: '#75BAFF',
		color: '#fff'
	});
	*/
});

function _toggle(THIS, tableId, variable)
{	
	if(variable)
	{
		$(THIS).text('Disable').removeClass('btn-primary').addClass('btn-light');
		$('#' + tableId).fadeIn(333);
	} else
	{
		$(THIS).text('Enable').removeClass('btn-light').addClass('btn-primary');
		$('#' + tableId).fadeOut(333);
	}
}

function toggleParams(THIS)
{
	IS_PARAMS = !IS_PARAMS;
	_toggle(THIS, 'idTableParams', IS_PARAMS);
}

// [START PARAM]
function addParam()
{
	let time = new Date().getTime();
	let str = `
		<div class='row my-1'>
			<div class='col-lg-5 col-sm-4'>
				<input class='form-control' placeholder='Param key' name='paramKey' id='idParamKey${time}' time-stamp='${time}' />
			</div>
			<div class='col-lg-5 col-sm-4'>
				<input class='form-control' placeholder='Param value' name='paramValue' id='idParamValue${time}' />
			</div>
			<div class='col-lg-2 col-sm-2'>
				<button class='btn btn-light' onclick='removeParam(this)'>Remove</button>
			</div>
		</div>
	`;
	divParams.append(str);
}

function removeParam(THIS)
{
	 $(THIS).parent().parent().remove();
}

function getParams()
{
	debugger;
	let paramKeys = document.getElementsByName("paramKey");
	
	let paramString = "";
	for(let i = 0; i< paramKeys.length; i++)
	{
		let paramName = paramKeys[i].value;
		let paramValue = document.getElementById("idParamValue" + paramKeys[i].getAttribute("time-stamp")).value;
		
		paramString += paramName + "=" + paramValue + "&";
	}
	
	if(paramString.length !== 0) 
	{
		paramString = paramString.substring(0, paramString.length - 1);
	}
	
	paramString = encodeURI(paramString);
	console.log("paramString: " + paramString);
	return paramString;
}
// [END PARAM]


// [START HEADER]
function addHeader()
{
	let time = new Date().getTime();
	
	let str = `
		<div class='row my-1'>
			<div class='col-lg-5 col-sm-4'>
				<input class='form-control' placeholder='Header key' name='headerKey' id='idHeaderKey${time}' time-stamp='${time}' />
			</div>
			<div class='col-lg-5 col-sm-4'>
				<input class='form-control' placeholder='Header value' name='headerValue' id='idHeaderValue${time}' />
			</div>
			<div class='col-lg-2 col-sm-4'>
				<button class='btn btn-light' onclick='removeHeader(this)'>Remove</button>
			</div>
		</div>
	`;

	divHeaders.append(str);	 
 }
 
function removeHeader(THIS)
{
	$(THIS).parent().parent().remove();
}

function getHeaders()
{
	let headerKeys = document.getElementsByName("headerKey");
	
	let headerString = "";
	for(let i = 0; i< headerKeys.length; i++)
	{
		let paramName = headerKeys[i].value;
		let paramValue = document.getElementById("idHeaderValue" + headerKeys[i].getAttribute("time-stamp")).value;
		
		headerString += paramName + "=" + paramValue + "\n";
	}
	
	if(headerString.length !== 0) 
	{
		headerString = headerString.substring(0, headerString.length - 1);
	}
	
	console.log("headerString: " + headerString);
}
// [END HEADER]

// [START AUTHORIZATIONS]
function addAuthorizations()
{
	let time = new Date().getTime();
	let str = `
		<div class='row my-1'>
			<div class='col-lg-5 col-sm-4'>
				<input class='form-control' placeholder='Authorizations key' name='authorizationKey' id='idAuthorizationKey${time}' time-stamp='${time}' />
			</div>
			<div class='col-lg-5 col-sm-4'>
				<input class='form-control' placeholder='Authorizations value' name='authorizationValue' id='idAuthorizationValue${time}' />
			</div>
			<div class='col-lg-2 col-sm-4'>
				<button class='btn btn-light' onclick='removeAuthorizations(this)'>Remove</button>
			</div>
		</div>
	`;

	divAuthorizations.append(str);	 
}

function removeAuthorizations(THIS)
{
	$(THIS).parent().parent().remove();
}

function disableButton(obj)
{
   disableThis(obj);
   $(obj).addClass("disabled");
}
function enableButton(obj)
{
   $(obj).removeClass("disabled");
   enableThis(obj);
}
function disableThis(obj) 
{
   $(obj).prop("disabled", true);
}
function enableThis(obj) 
{
   $(obj).prop("disabled", false);
}

function beautifyRequestBody()
{
	$('#idTextRequestBody').val(beautifyAndMinify($('#idTextRequestBody').val(), 3));
}

function minifyRequestBody()
{
	$('#idTextRequestBody').val( beautifyAndMinify( $('#idTextRequestBody').val(), 0));
}

function beautifyAndMinify(str, paddingSize)
{
	return JSON.stringify(JSON.parse(str), null, paddingSize);
}

// -------------------------------
function request(THIS)
{
	var data = JSON.stringify(
	{
		"ACTION": "scl_testApi",
		"APP_VERSION": "500",
		"APP_TYPE": "CUSTOMER",
		"REQ_SOURCE": "ANDROID",
		"param0": "10",
		"param1": "20",
		"ACCESS_TOKEN": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxIiwiaWF0IjoxNTY0NDAyNzkyLCJpc3MiOiI2OWEyNDM5Mjk3OWI0YzI1ZGQyYjU4ZGM4ODJmOTJhNiJ9.Dra7JCCQcs0uFZfTq67k44FvSu9c4hX_pmpNFJya64Q"
	});
	
	data = JSON.stringify(JSON.parse($('#idTextRequestBody').val()));
	
	var method = $('#idSelectMethod').val();
	var params = getParams();
	params = params && params === '' ? '' : '?' + params;
	var url = $('#idInputUrl').val() + params;

	//var xhr = new XMLHttpRequest();
	//xhr.withCredentials = true;
	
	var xhr = createCORSRequest(method, url);
	if (!xhr)
	{
		throw new Error('CORS not supported');
	}
	xhr.addEventListener("readystatechange", function () 
	{
		if (this.readyState === 4) 
		{
			console.log(this.responseText);
		}
	});

	xhr.setRequestHeader("Content-Type", "application/json");
	//xhr.setRequestHeader("Accept", "*/*");
	//xhr.setRequestHeader("Cache-Control", "no-cache");
	//xhr.setRequestHeader("Host", "localhost:8080");
	//xhr.setRequestHeader("Cookie", "X-XSRF-TOKEN=SuhelKhan");
	//xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
	//xhr.setRequestHeader("Content-Length", "335");
	//xhr.setRequestHeader("Connection", "keep-alive");
	//xhr.setRequestHeader("cache-control", "no-cache");

	xhr.send(data);
}

function createCORSRequest(method, url)
{
	var xhr = new XMLHttpRequest();

	if ("withCredentials" in xhr)
	{
		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest != "undefined")
	{
		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else 
	{
		// Otherwise, CORS is not supported by the browser.
		xhr = null;
	}
	return xhr;
}
/*
var xhr = createCORSRequest('GET', url);
if (!xhr) {
	throw new Error('CORS not supported');
}
*/

function sendRequest(THIS)
{
	debugger;
	var params = getParams();
	params = params && params === '' ? '' : '?' + params;

	$.ajax(
	{
		async: true,
		url: $('#idInputUrl').val() + params,
		type: $('#idSelectMethod').val(),
		//data: {  getParams()  },
		//dataType: 'json',
		//contentType: "application/json; charset=utf-8",
		beforeSend: function (xhr)
		{
			disableButton(THIS);
		},
		complete: function (xhr, status)
		{
			//debugger;
			console.log(
			'complete():'
			+ '\nHeaders:\n'+ xhr.getAllResponseHeaders()
			+ '\nxhr: ' + JSON.stringify(xhr, null, 3)
			+ '\nstatus:' + status							
			);
			debugger;
			if(xhr.getAllResponseHeaders())
			{
				let heradersString = xhr.getAllResponseHeaders();
				if(heradersString.indexOf('content-type: text/html;') >= 0)
				{
					$('#idDivResponse').html(xhr.responseText);
				} else if(heradersString.indexOf('content-type: text/json;') >= 0
							|| heradersString.indexOf('content-type: application/json;') >= 0)
					{
						$('#idPreResponse').text(JSON.stringify(JSON.parse(xhr.responseText), null, 3)).show('slow');
				}
			}
			$('#idDivResponseBox').show('slow');
			enableButton(THIS);
		},
		success: function (response, status, xhr)
		{
		},
		error: function (xhr, status, error)
		{
		}
	});
}
