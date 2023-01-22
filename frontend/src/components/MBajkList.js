import { List, Datagrid, TextField, DateField, EditButton, DeleteButton } from 'react-admin';

function MBajkList(props) {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="_id"/>
                <TextField source="name"/>
                <TextField source="number"/>
                <DateField source="createdAt"/>
                <EditButton basePath="/users"/>
                <DeleteButton basePath="/user"/>
            </Datagrid>
        </List>
    )
}

export default MBajkList;