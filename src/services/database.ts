import odbc from 'odbc';

const Server = process.env.DB_SERVER;
const Database = process.env.DB_NAME;   
const UID = process.env.DB_USER;
const PWD = process.env.DB_PASSWORD; 
const Driver = '{ODBC Driver 18 for SQL Server}';

const connectionString = `Driver=${Driver};Server=${Server};Database=${Database};UID=${UID};PWD=${PWD};Authentication=ActiveDirectoryPassword;`;;

export async function getOdbcConnection() {
  try {
    console.log("Intentando conectar con la cadena:", connectionString);
    const connection = await odbc.connect(connectionString);
    console.log("Conexión ODBC establecida exitosamente.");

   
    if (connection.beginTransaction && typeof connection.beginTransaction === 'function') {
      console.log("La conexión soporta transacciones.");
    } else {
      console.error("La conexión no soporta transacciones.");
    }

    return connection;
  } catch (error) {
    console.error("Error conectando a SQL Server con ODBC:", error);
    throw error;
  }
}










