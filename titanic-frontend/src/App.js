import * as React from "react";
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from "ra-data-json-server"
// import { UserList } from './users'
// import { PostList, PostEdit, PostCreate } from './posts'

//const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const data = jsonServerProvider('http://localhost:8001/titanic')
const App = () => (
  <Admin dataProvider = {data}>
      
      <Resource name = "passengers/" list = {ListGuesser} />

  </Admin>
);

export default App;