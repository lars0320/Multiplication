import 'react-native-gesture-handler';
import React, { useState } from 'react' 
import {SafeAreaView, StyleSheet, TextInput, View, Text, Button, ScrollView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';





class NamePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userName: ''
    };
  }
  render() {
    return(
      <SafeAreaView style={styles.container}>
        <Text style={styles.appTitle}>이름을 입력해주세요.</Text>

        <View style={styles.ground}>
          <TextInput 
            style={styles.input} 
            onChangeText={ (userName) => this.setState({userName})}
            placeholder="name" 
            onSubmitEditing={() => this.props.navigation.navigate('GamePage', {userName: this.state.userName})}
          />
        </View>

      </SafeAreaView>
    );
  }
}

class GamePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userName: this.props.route.params,
      firstNumber: Math.ceil(Math.random() * 9),
      secondNumber: Math.ceil(Math.random() * 9),
      gameState: false,
      answer: "",
      value: "",
      text: "",
      score: 0,
      interval: null,
      intervalNumber: 10,
      records: [],
      scoreState: false,
    }
    this.gameStart = this.gameStart.bind(this);
    this.submit = this.submit.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.intervalCounter = this.intervalCounter.bind(this);
    this.gameSave = this.gameSave.bind(this);
    this.reset = this.reset.bind(this);
    this.goMain = this.goMain.bind(this);
  }
  gameStart() {
    this.setState({
      gameState: true,
      interval : setInterval(() => {
        this.intervalCounter()
        if (this.state.intervalNumber === 0) {
          this.stopGame()
        }
      }, 1000)
    })
  }

  stopGame() {
    clearInterval(this.state.interval)
    this.gameSave()
    this.reset()
    this.setState({
      scoreState: true
    })
  }

  reset() {
    this.setState({
      intervalNumber: 10,
      gameState: false,
      value: "",
      score: 0
    })
  }

  intervalCounter() {
    this.setState({ 
      intervalNumber : this.state.intervalNumber - 1
    })
  }

  submit() {
    if(parseInt(this.state.value) === this.state.firstNumber * this.state.secondNumber) {
      this.setState({
        score: this.state.score + 1
      })
    } else {
      this.setState({
        score: this.state.score - 1
      })
    }
    this.setState({
      firstNumber: Math.ceil(Math.random() * 8 + 1),
      secondNumber: Math.ceil(Math.random() * 9),
      value: ""
    })
  }

  valueChange(value) {
    this.setState({
      value: value
    })
  }


  gameSave() {
    
    const name = this.state.userName["userName"]
    const score = this.state.score

    AsyncStorage.getItem('recordData', (err, result) => {
      const records = JSON.parse(result);
      const saveData = []
      if ( records ) { 
        records.map((record) => {
          saveData.push({"name":record.name, "score":record.score})
        })
      }
      
      saveData.push({ "name":name,"score":score })
      
      AsyncStorage.setItem('recordData',JSON.stringify(saveData))
      this.setState({
        records: saveData
      })
    });


  }

  goMain() {
    this.setState({
      scoreState: false
    })
  }

  render() {

    if ( this.state.gameState ) {
      
      return(


          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{this.state.firstNumber} * {this.state.secondNumber} = ?</Text>
            <TextInput
              style={styles.input}
              placeholder="정답을 입력해주세요"
              onChangeText={this.valueChange}
              onSubmitEditing={this.submit}
              value={this.state.value}
            ></TextInput>
            <Text>{this.state.score}</Text>
            <Text>남은 시간 : {this.state.intervalNumber}</Text>
            
          </View>

      );

    } else {

    if( this.state.scoreState ) {
      const records = []
      {this.state.records.map((record) => {

        if ( records.find( array => array.name === record.name && parseInt(array.score) >= parseInt(record.score))) {
          return
        }
        
        if ( records.find( array => array.name === record.name && parseInt(array.score) >= parseInt(record.score))) {
          const deleteScore = records.find( array => array.name === record.name && array.score >= record.score) 
          const deleteIndex = records.indexOf(deleteScore)
          records.splice(deleteIndex, 1)
        }
        
        records.push({
          name: record.name, score: record.score
        })
      })}
      
      return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button 
            onPress={this.goMain}
            title="메인화면으로"
          ></Button>
        {records.map((record) => {
          return (
          <ScrollView>
            <Text>
              이름 : {record.name} - 점수 : {record.score}
            </Text>
          </ScrollView>
          )
        })}
         
        </View>
      )
    } else {

      return(
      
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button 
            onPress={this.gameStart}
            title="게임시작"
          ></Button>
        </View>

      );
    }
  }
}
}


class ScorePage extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
      if( this.state.scoreState ) {
        const records = []
        {this.state.records.map((record) => {
  
          if ( records.find( array => array.name === record.name && parseInt(array.score) >= parseInt(record.score))) {
            return
          }
          
          if ( records.find( array => array.name === record.name && parseInt(array.score) >= parseInt(record.score))) {
            const deleteScore = records.find( array => array.name === record.name && array.score >= record.score) 
            const deleteIndex = records.indexOf(deleteScore)
            records.splice(deleteIndex, 1)
          }
          
          records.push({
            name: record.name, score: record.score
          })
        })}
        
        return(
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button 
              onPress={this.goMain}
              title="메인화면으로"
            ></Button>
          {records.map((record) => {
            return (
            <ScrollView>
              <Text>
                이름 : {record.name} - 점수 : {record.score}
              </Text>
            </ScrollView>
            )
          })}
           
        </View>
      )
    }
  }
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name=" " component={NamePage} />
        <Stack.Screen name="GamePage" component={GamePage} />
        <Stack.Screen name="ScorePage" component={ScorePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  appTitle: {
    color: '#fff',
    fontSize: 36,
    marginTop: 30,
    marginBottom: 30,
    fontWeight: '300',
    textAlign: 'center',
  },

  ground: {
    backgroundColor: '#fff'
  },

  input: {
    textAlign: 'center',
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20
  },

});

export default App;
