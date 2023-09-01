const date = new Date()

const standard_values = {
    'http://www.w3.org/2001/XMLSchema#integer' : 0,
    'http://www.w3.org/2001/XMLSchema#double' : 0.0,
    'http://www.w3.org/2001/XMLSchema#string' : '',
    'http://www.w3.org/2001/XMLSchema#boolean' : false,
    'http://www.w3.org/2001/XMLSchema#dateTime' : date.toISOString(),
    'http://www.w3.org/2001/XMLSchema#date' :  date.toISOString(),
}
export default standard_values; 