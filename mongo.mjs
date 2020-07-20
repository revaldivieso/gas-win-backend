import mongoose from 'mongoose';

mongoose.connect(process.env.CONN, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected online")
});

const personSchema = new mongoose.Schema({ 
    name: 'string', 
    rut: 'string', 
    address: 'string', 
    position: 'string',
    status: 'string'
});
const Person = mongoose.model('Person', personSchema);


export const updateStatusPerson = async (id, status) => {
    return await Person.update({ _id: id}, { status: status });
}

export const savePerson = (person) => {
    person.status = 'pending';
    const Doc = new Person(person);
    Doc.save(function (err) {
        if (err) return handleError(err);
        // saved!
    });
    return Doc;
}

export const listPerson = async () => {
   
      const newList= await Person.find().exec();
      return newList;
    
}

export const findPersonByRut = async (rut) => {
    const searchPerson = await Person.findOne({ 'rut': rut }).exec();
    return searchPerson;
}





