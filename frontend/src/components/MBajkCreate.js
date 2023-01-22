import { Create, SimpleForm, TextInput, DateInput } from 'react-admin';

function MBajkCreate(props) {
    return (
        <Create title="ADD MBAJK LOCATION" {...props}>
            <SimpleForm>
                <TextInput source="title"/>
                <TextInput multiline source="body"/>
                <DateInput label="added" source="createdAt"/>
            </SimpleForm>
        </Create>
    );
}

export default MBajkCreate;