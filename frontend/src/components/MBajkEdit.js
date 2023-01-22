import { Edit, SimpleForm, TextInput, DateInput } from 'react-admin';

// STILL NEED FUNCTION TO UPDATE AND REMOVE MBAJK LOCATION IN CONTROLLER (PUT, DELETE)


function MBajkEdit(props) {
    return (
        <Edit title="EDIT MBAJK LOCATION" {...props}>
            <SimpleForm>
                <TextInput disabled source="_id"/>
                <TextInput source="name"/>
                <TextInput multiline source="number"/>
                <DateInput label="added" source="createdAt"/>
            </SimpleForm>
        </Edit>
    );
}

export default MBajkEdit;