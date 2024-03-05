import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  const [amount, setAmount] = useState('');

  const db = SQLite.openDatabase('shoppinglist.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, amount int, product text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist (amount, product) values (?, ?);', [parseInt(amount), input]);
    });
    setInput('');
    setAmount('');
    updateList();
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) => {
        setData(rows._array);
    });
    });
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
        tx.executeSql('delete from shoppinglist where id = ?;', [id]);
      }, null, updateList
    )
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#CED0CE",
          marginLeft: "10%"
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="insert product"
        onChangeText={input => setInput(input)}
        value={input}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="insert amount"
        onChangeText={amount => setAmount(amount)}
        value={amount}
      ></TextInput>
      <View>
        <Button
          title="Add"
          onPress={saveItem}
        ></Button>
      </View>
      <Text
        style={{ paddingTop: 10, fontSize: 20, fontWeight: 'bold', color: 'blue' }}
      >Shopping List</Text>
      <FlatList
        style={{ maxHeight: 200, paddingTop: 10 }}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text>{item.product}, {item.amount}</Text>
            <Text style={{ color: '#0000ff', paddingLeft: 10 }} onPress={() => deleteItem(item.id)}>Bought</Text>
          </View>}
        data={data}
        ItemSeparatorComponent={listSeparator}
      ></FlatList>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  }

});
