import React, { Component } from "react";
import { Animated, Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
class FadingMessage extends Component {
    constructor(props) {
       super(props);
 
       this.state = {fadeIn: new Animated.Value(0),
                     fadeOut: new Animated.Value(1),
                    };
    }
 
    fadeIn() {
      this.state.fadeIn.setValue(0)                  
      Animated.timing(
        this.state.fadeIn,           
        {
          toValue: 1,                   
          duration: 0,              
        }
      ).start(() => this.fadeOut());                        
   }
 
   fadeOut() {
    Animated.timing(                  
       this.state.fadeIn,            
       {
         toValue: 0,                   
         duration: 1000,              
       }
    ).start();                        
  }


   render() {
    this.fadeIn();
     return(
        <View style={{flex: 1, backgroundColor: '#efefef', position: 'relative'}}>
            
            
            {/* <Button title="Click" onPress={()=> {
               
            }}
 
             /> */}
            
 
            <Animated.View                 
               style={{opacity: this.state.fadeIn}}
            >
               <View style={{ height: '100%', width: '100%', backgroundColor: 'gray', justifyContent: 'center'}}>
                 <Text style={{fontSize: 20, textAlign: 'center'}}>Please wait...</Text>
              </View>
            </Animated.View>
        </View>
    );
 
  }
 }

export default FadingMessage;