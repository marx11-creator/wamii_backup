import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    textAlign: 'center',
    height: 30,
    width: '90%',
    padding: 4,
    marginBottom: 7,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 5,
  },
  viewDefault: {
    height: 2,
    backgroundColor: 'lightblue',
    marginBottom: 10,
    width: '90%',
    borderColor: 'lightgreen',
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    //padding: 20,
    margin: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  LinearButton: {
    width: 190,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  viewForText: {
    height: 50,
    width: '90%',
    padding: 4,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: 'lightgreen',
    borderRadius: 5,
  },
});
