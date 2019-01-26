function createSuccessCallback(callback) {
	return "(function(httpResponse) {\n"
		+ "var inputStream = httpResponse.getEntity().getContent();\n"
		+ "var content = org.apache.commons.io.IOUtils.toString(inputStream);\n"
		+ "var response = {};\n"
		+ "response.statusCode = httpResponse.getStatusLine().getStatusCode();\n"
		+ "response.headers = httpResponse.getAllHeaders();\n"
		+ "response.data = content;\n"
		+ "(" + callback + ")(response);\n"
		+ "})(__context.get('response'));\n";
}

function createErrorCallback(callback) {
	if (callback) {
		return "(" + callback + ")(__context.get('exception'))";
	}
}

function createCancelCallback(callback) {
	if (callback) {
		return "(" + callback + ")()";
	}
}

function createHttpResponseCallback(httpClient, successCallback, errorCallback, cancelCallback) {
	return httpClient.createCallback(
		createSuccessCallback(successCallback),
		createErrorCallback(errorCallback),
		createCancelCallback(cancelCallback)
	);
}

function HttpAsyncClient() {
	
	this.httpClient = new org.eclipse.dirigible.engine.js.rhino.api.v3.http.HttpClientAsync();

	this.getAsync = function(url, config) {
		var callback = createHttpResponseCallback(
			this.httpClient,
			config.success,
			config.error,
			config.cancel
		);
		this.httpClient.getAsync(url, null, callback);
	};

	this.execute = function() {
		this.httpClient.execute();
	};
}

exports.getInstnace = function() {
	return new HttpAsyncClient();
};