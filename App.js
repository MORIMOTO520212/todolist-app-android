/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Platform, 
  ScrollView, 
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODOを保持するキーバリューストアのキーを定義
const TODO = "@todoapp.todo"

// ステータスバーの高さを考慮
const STATUSBAR_HIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;

export default class App extends React.Component {

  // コンストラクタを定義
  constructor(props) {
    super(props)
    // stateを初期化
    this.state = {
      todo: [],
      currentIndex: 0,
      inputText: "",
    }
  }

  // コンポーネントがマウントされた段階で読み込みを行う
  componentDidMount() {
    this.loadTodo()
  }

  // AsyncStorageからTODOを読み込む処理
  loadTodo = async () => {
    try {
      const todoString = await AsyncStorage.getItem(TODO)
      if(todoString){
        const todo = JSON.parse(todoString)
        const currentIndex = todo.length
        this.setState({todo: todo, currentIndex: currentIndex})
      }
    } catch(e) {
      console.log(e)
    }
  }

  // AsyncStorageへTODOを保存する
  saveTodo = async (todo) => {
    try {
      const todoString = JSON.stringify(todo) // json文字列化
      await AsyncStorage.setItem(TODO, todoString)
    } catch(e) {
      console.log(e)
    }
  }

  // リスト追加関数
  onAddItem = () => {
    const title = this.state.inputText
    if(title == ""){
      return
    }
    const index = this.state.currentIndex + 1
    const newTodo = {index: index, title: title, done: false}
    const todo = [...this.state.todo, newTodo] // 配列push
    // 配列更新
    this.setState({
      todo: todo,
      currentIndex: index,
      inputText: ""
    })

    // ストレージに保存
    this.saveTodo(todo)
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        { /* フィルタの部分 */ }
        <View style={styles.filter}>
          <Text>Filterがここに配置されます</Text>
        </View>

        { /* TODOリスト */ }
        <ScrollView style={styles.todolist}>
          <FlatList
           data={this.state.todo}
           renderItem={({item}) => <Text>{item.title}</Text>}
           keyExtractor={(item, index) => "todo_" + item.index}
          />
        </ScrollView>

        { /* 入力スペース */ }
        <View style={styles.input}>
          { /* テキスト入力とボタンを追加 */ }
          <TextInput
            onChangeText={(text) => this.setState({inputText: text})}
            value={this.state.inputText}
            style={styles.inputText}
          />
          <Button onPress={this.onAddItem} title="Add" color="#841584" style={styles.inputButton}/>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: STATUSBAR_HIGHT,
  },
  filter: {
    height: 30, // 単位dp
  },
  todolist: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  input: {
    height: 40,
    flexDirection: 'row',
  },
  inputText: {
    flex: 1,
  },
  inputButton: {
    width: 100,
  }
});