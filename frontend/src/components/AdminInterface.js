// import admin interface
import { Admin, Resource, ListGuesser } from 'react-admin';
// import data provider
import restProvider from 'ra-data-json-server';

// CRUD operations for admin interface
import MBajkList from './MBajkList';
import MBajkCreate from './MBajkCreate';
import MBajkEdit from './MBajkEdit';

//const dataProvider = restProvider("https://jsonplaceholder.typicode.com");
//const dataProvider = jsonServerProvider("https://api.jcdecaux.com/vls/v3/stations?apiKey=frifk0jbxfefqqniqez09tw4jvk37wyf823b5j1i&contract=maribor");

function AdminInterface() {

    //window.location.href = "http://localhost:3001/admin/mbajk";

    return(
        <Admin dataProvider={restProvider("http://localhost:3001")}>
            <Resource
                name="/admin/mbajk"
                list={MBajkList}
                create={MBajkCreate}
                edit={MBajkEdit}/>
        </Admin>
    );
}

export default AdminInterface;